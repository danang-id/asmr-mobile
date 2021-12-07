import {createContext} from 'react';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import User from 'asmr/core/entities/User';
import Role from 'asmr/core/enums/Role';

export interface AuthenticationContextInfo {
	businessAnalytics?: StructuredBusinessAnalytics;
	user?: User;
	isAuthenticated: boolean;
	isBusinessAnalyticsLoading: boolean;
	isUserLoading: boolean;
	isAuthorized(roles: Role[]): boolean;
	refresh(): Promise<void>;
	signIn(username?: string, password?: string): Promise<void>;
	signOut(): Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationContextInfo>({
	isAuthenticated: false,
	isBusinessAnalyticsLoading: false,
	isUserLoading: false,
	isAuthorized() {
		return false;
	},
	signIn() {
		return Promise.resolve({} as never);
	},
	signOut() {
		return Promise.resolve({} as never);
	},
	refresh() {
		return Promise.resolve();
	},
});

export default AuthenticationContext;
