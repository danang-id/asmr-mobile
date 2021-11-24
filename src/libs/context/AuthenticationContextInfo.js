import ErrorInformation from '../../core/common/ErrorInformation';
import Role from '../../core/enums/Role';
import User from '../../core/entities/User';
import AuthenticationResponseModel from '../../core/response/AuthenticationResponseModel';
import type {ILogger} from '../common/Logger';

export type AuthenticationContextInfo = {
	user?: User,
	abort(): void,
	handleError(error?: Error, logger?: ILogger): void,
	handleErrors(errors?: ErrorInformation[], logger?: ILogger): void,
	isAuthenticated(): boolean,
	isAuthorized(roles: Role[]): boolean,
	refresh(): Promise<void>,
	signIn(username?: string, password?: string): Promise<AuthenticationResponseModel>,
	signOut(): Promise<AuthenticationResponseModel>,
};
