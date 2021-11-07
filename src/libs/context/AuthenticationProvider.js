import React, {FC, useEffect} from 'react';
import User from '../../core/entities/User';
import parseEntity from '../common/EntityParser';
import useInit from '../hooks/InitHook';
import usePersistedState from '../hooks/PersistedStateHook';
import useServices from '../hooks/ServiceHook';
import AuthenticationContext from './AuthenticationContext';
import useLogger from '../hooks/LoggerHook';
import ErrorCode from '../../core/enums/ErrorCode';

const AuthenticationProvider: FC = ({children}) => {
	useInit(onInit);
	const logger = useLogger(AuthenticationProvider);
	const services = useServices();
	const [user, setUser] = usePersistedState('AUTHENTICATED_USER');

	function parseUserData(data: User): User {
		const clone = parseEntity(data);
		const roles = [];
		for (const role of clone.roles) {
			roles.push(parseEntity(role));
		}
		clone.roles = roles;
		return clone;
	}

	function isAuthenticated() {
		return !!user;
	}

	function isAuthorized(roles: Number[]) {
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

	async function onInit() {
		await updateUserData();
	}

	async function signIn(username?: string, password?: string) {
		const response = await services.gate.authenticate({username, password, rememberMe: true});
		if (response.isSuccess && response.data) {
			setUser(parseUserData(response.data));
		}

		return response;
	}

	async function signOut() {
		const response = await services.gate.clearSession();
		if (response.isSuccess) {
			setUser(undefined);
		}
		return response;
	}

	async function updateUserData() {
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

	useEffect(() => {
		const info = user ? `${user.username} (${user.emailAddress})` : 'null';
		logger.info('Auth Changed:', info);
	}, [user]);

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
