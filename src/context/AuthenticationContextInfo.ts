import ErrorInformation from 'asmr/core/common/ErrorInformation';
import User from 'asmr/core/entities/User';
import Role from 'asmr/core/enums/Role';
import AuthenticationResponseModel from 'asmr/core/response/AuthenticationResponseModel';
import {ILogger} from 'asmr/libs/common/Logger';

interface AuthenticationContextInfo {
	user?: User;
	abort(): void;
	handleError(error?: Error, logger?: ILogger): void;
	handleErrors(errors?: ErrorInformation[], logger?: ILogger): void;
	isAuthenticated(): boolean;
	isAuthorized(roles: Role[]): boolean;
	refresh(): Promise<void>;
	signIn(username?: string, password?: string): Promise<AuthenticationResponseModel>;
	signOut(): Promise<AuthenticationResponseModel>;
}

export default AuthenticationContextInfo;
