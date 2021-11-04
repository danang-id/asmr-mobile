import React, {FC, useEffect} from 'react';
import ErrorCode from '../../core/enums/ErrorCode';
import User from '../../core/entities/User';
import parseEntity from '../common/EntityParser';
import useInit from '../hooks/InitHook';
import usePersistedState from '../hooks/PersistedStateHook';
import useServices from '../hooks/ServiceHook';
import AuthenticationContext from './AuthenticationContext';
import useLogger from '../hooks/LoggerHook';

interface AuthenticationProviderProps {}

const AuthenticationProvider: FC<AuthenticationProviderProps> = ({children}) => {
	useInit(onInit);
	const logger = useLogger(AuthenticationProvider);
	const [user, setUser] = usePersistedState('AUTHENTICATED_USER');
	const services = useServices();

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
				const hasNotAuthenticatedError =
					response.errors.findIndex(error => error.code === ErrorCode.NotAuthenticated) !== -1;
				if (!hasNotAuthenticatedError) {
					services.handleErrors(response.errors, logger);
					return;
				}

				if (isAuthenticated()) {
					// TODO: Redirect Authenticated
				}
			}
		} catch (error) {
			services.handleError(error, logger);
		}
	}

	useEffect(() => {
		logger.info('Auth Changed', user);
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
