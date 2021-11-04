import {createContext, Context} from 'react';
import type {AuthenticationContextInfo} from './AuthenticationContextInfo';

const AuthenticationContext: Context<AuthenticationContextInfo> = createContext({
	abort: () => {},
	getAuthenticatedUser: () => {},
	handleError: () => {},
	handleErrors: () => {},
	isAuthenticated: () => false,
	isAuthorized: () => false,
	signIn: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
	updateUserData: () => Promise.resolve(),
});

export default AuthenticationContext;
