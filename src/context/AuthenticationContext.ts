import {createContext} from 'react';
import AuthenticationContextInfo from 'asmr/context/AuthenticationContextInfo';

const AuthenticationContext = createContext<AuthenticationContextInfo>({
	abort() {
		/* Nothing to do */
	},
	handleError() {
		/* Nothing to do */
	},
	handleErrors() {
		/* Nothing to do */
	},
	isAuthenticated() {
		return false;
	},
	isAuthorized() {
		return false;
	},
	refresh() {
		return Promise.resolve();
	},
	signIn() {
		return Promise.resolve({} as never);
	},
	signOut() {
		return Promise.resolve({} as never);
	},
});

export default AuthenticationContext;
