import React, {FC, useEffect} from 'react';
import Gleap from 'react-native-gleapsdk';
import {GLEAP_TOKEN} from '@env';
import ErrorCode from '../../core/enums/ErrorCode';
import User from '../../core/entities/User';
import AuthenticationResponseModel from '../../core/response/AuthenticationResponseModel';
import parseEntity from '../common/EntityParser';
import useInit from '../hooks/InitHook';
import useLogger from '../hooks/LoggerHook';
import usePersistedState from '../hooks/PersistedStateHook';
import type {PersistedStateResult} from '../hooks/PersistedStateHook';
import usePrevious from '../hooks/PreviousHook';
import useServices from '../hooks/ServiceHook';
import AuthenticationContext from './AuthenticationContext';

const AuthenticationProvider: FC = ({children}) => {
	useInit(onInit);
	const logger = useLogger(AuthenticationProvider);
	const {abort, handleError, handleErrors, gate: gateService} = useServices();
	const [user, setUser]: PersistedStateResult<User> = usePersistedState('AUTHENTICATED_USER');
	const previousUser = usePrevious(user);

	function onInit(): Promise<void> {
		return refresh();
	}

	function onAuthenticationRefreshed(): void {
		const logAuthChange = () => {
			logger.info('Authentication Changed:', user ? `${user.username} (${user.emailAddress})` : 'null');
		};

		if (!previousUser && !user) {
			// Both undefined or null, not changed
			return;
		}
		if ((!previousUser && !!user) || (!!previousUser && !user)) {
			// Sign in or sign out activity
			if (user) {
				if (GLEAP_TOKEN) {
					Gleap.logEvent('Authentication: Sign in', user);
					Gleap.identify(user.id, {
						name: user.firstName + ' ' + user.lastName,
						email: user.emailAddress,
					});
				}
			} else {
				if (GLEAP_TOKEN) {
					Gleap.logEvent('Authentication: Sign out', {});
					Gleap.clearIdentity();
				}
			}

			logAuthChange();
		}

		// Algorithm below should not have happened because for user ID to have changed,
		// ones need to sign out and then sign in. But it here to completes the missing
		// logical structure.
		if (!!previousUser && !!user) {
			if (previousUser.id !== user.id) {
				logAuthChange();
			}
		}
	}

	function parseUserData(data: User): User {
		const clone = parseEntity(data);
		const roles = [];
		for (const role of clone.roles) {
			roles.push(parseEntity(role));
		}
		clone.roles = roles;
		return clone;
	}

	function isAuthenticated(): boolean {
		return !!user;
	}

	function isAuthorized(roles: Number[]): boolean {
		if (!user?.roles) {
			return false;
		}

		if (!roles || !Array.isArray(roles)) {
			return false;
		}

		for (const userRole of user.roles) {
			if (roles.findIndex(role => role === userRole.role) !== -1) {
				return true;
			}
		}

		return false;
	}

	async function refresh(): Promise<void> {
		try {
			const result = await gateService.getUserPassport();
			if (result.isSuccess && result.data) {
				setUser(parseUserData(result.data));
			}

			if (result.errors && Array.isArray(result.errors)) {
				const unauthenticatedError = result.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					handleErrors(result.errors, logger);
				}
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	async function signIn(username?: string, password?: string): Promise<AuthenticationResponseModel> {
		const result = await gateService.authenticate({username, password, rememberMe: true});
		if (result.isSuccess && result.data) {
			setUser(parseUserData(result.data));
			// await FileCaching.fetchToCache(response.data.image);
		}

		return result;
	}

	async function signOut(): Promise<AuthenticationResponseModel> {
		const result = await gateService.clearSession();
		if (result.isSuccess) {
			// await FileCaching.removeCache(user.image);
			setUser(undefined);
		}
		return result;
	}

	useEffect(onAuthenticationRefreshed, [user]);

	return (
		<AuthenticationContext.Provider
			value={{
				user: user,
				abort: abort,
				handleError: handleError,
				handleErrors: handleErrors,
				isAuthenticated: isAuthenticated,
				isAuthorized: isAuthorized,
				refresh: refresh,
				signIn: signIn,
				signOut: signOut,
			}}>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default AuthenticationProvider;
