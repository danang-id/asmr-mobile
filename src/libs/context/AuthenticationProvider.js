import React, {FC, useEffect} from 'react';
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
	const services = useServices();
	const [user, setUser]: PersistedStateResult<User> = usePersistedState('AUTHENTICATED_USER');
	const previousUser = usePrevious(user);

	function onInit(): Promise<void> {
		return updateUserData();
	}

	function onUserDataChanged(): void {
		const logAuthChange = () => {
			logger.info('Authentication Changed:', user ? `${user.username} (${user.emailAddress})` : 'null');
		};

		if (!previousUser && !user) {
			// Both undefined or null, not changed
			return;
		}
		if ((!previousUser && !!user) || (!!previousUser && !user)) {
			// Sign in or sign out activity
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

	async function signIn(username?: string, password?: string): Promise<AuthenticationResponseModel> {
		const response = await services.gate.authenticate({username, password, rememberMe: true});
		if (response.isSuccess && response.data) {
			setUser(parseUserData(response.data));
			// await FileCaching.fetchToCache(response.data.image);
		}

		return response;
	}

	async function signOut(): Promise<AuthenticationResponseModel> {
		const response = await services.gate.clearSession();
		if (response.isSuccess) {
			// await FileCaching.removeCache(user.image);
			setUser(undefined);
		}
		return response;
	}

	async function updateUserData(): Promise<AuthenticationResponseModel> {
		try {
			const response = await services.gate.getUserPassport();
			if (response.isSuccess && response.data) {
				setUser(parseUserData(response.data));
			}

			if (response.errors && Array.isArray(response.errors)) {
				const unauthenticatedError = response.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					services.handleErrors(response.errors, logger);
				}
			}
		} catch (error) {
			services.handleError(error, logger);
		}
	}

	useEffect(onUserDataChanged, [user]);

	return (
		<AuthenticationContext.Provider
			value={{
				user: user,
				abort: services.abort,
				handleError: services.handleError,
				handleErrors: services.handleErrors,
				isAuthenticated: isAuthenticated,
				isAuthorized: isAuthorized,
				signIn: signIn,
				signOut: signOut,
				updateUserData: updateUserData,
			}}>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default AuthenticationProvider;
