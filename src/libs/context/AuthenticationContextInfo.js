import ErrorInformation from '../../core/common/ErrorInformation';
import type {ILogger} from '../common/Logger';

export type AuthenticationContextInfo = {
	user?: User,
	abort(): void,
	handleError(error?: Error, logger?: ILogger): void,
	handleErrors(errors?: ErrorInformation[], logger?: ILogger): void,
	isAuthenticated(): boolean,
	isAuthorized(roles: Role[]): boolean,
	signIn(username?: string, password?: string): Promise<AuthenticationResponseModel>,
	signOut(): Promise<AuthenticationResponseModel>,
	updateUserData(): Promise<void>,
};
