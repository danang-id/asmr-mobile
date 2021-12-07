// import {useEffect, useState} from 'react';
// import {Alert} from 'react-native';
// import User from 'asmr/core/entities/User';
// import UserWithToken from 'asmr/core/entities/UserWithToken';
// import ErrorCode from 'asmr/core/enums/ErrorCode';
// import Role from 'asmr/core/enums/Role';
// import AuthenticationResponseModel from 'asmr/core/response/AuthenticationResponseModel';
// import useLogger from 'asmr/hooks/logger.hook';
// import usePersistedState from 'asmr/hooks/persisted-state.hook';
// import useServices from 'asmr/hooks/service.hook';
// import useNativeSWR from 'asmr/hooks/swr.hook';
// import {findErrors, hasError} from 'asmr/libs/common/ResponseModel.helper';
//
// interface AuthenticationHook {
// 	isNotAuthenticated: boolean;
// 	isUserValidating: boolean;
// 	user?: User;
// 	isAuthorized(roles: Role[]): boolean;
// 	signIn(username?: string, password?: string): Promise<void>;
// 	signOut(): Promise<void>;
// }
//
// const AUTHENTICATED_USER_KEY = 'AUTHENTICATED_USER';
// const AUTHENTICATION_HOOK_TAG = 'AuthenticationHook';
// function showAlert(title: string, message: string) {
// 	Alert.alert(title, message, [
// 		{
// 			style: 'default',
// 			text: 'Try Again',
// 		},
// 	]);
// }
// function useAuthentication(): AuthenticationHook {
// 	const logger = useLogger(AUTHENTICATION_HOOK_TAG);
//
// 	const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(true);
// 	const [user, setUser] = usePersistedState<User>(AUTHENTICATED_USER_KEY);
//
// 	const {handleError, handleErrors, gate: gateService} = useServices(AUTHENTICATION_HOOK_TAG);
// 	const {data, error, isValidating, mutate} = useNativeSWR<UserWithToken, AuthenticationResponseModel>(
// 		shouldRevalidate ? AUTHENTICATED_USER_KEY : null,
// 		() => gateService.getUserPassport(),
// 		{
// 			fallbackData: user,
// 			shouldRetryOnError: false,
// 		},
// 	);
//
// 	const isNotAuthenticated = !user;
//
// 	function onDataChanged() {
// 		setUser(data);
// 	}
//
// 	function onErrorChanged() {
// 		if (!error) {
// 			return;
// 		}
//
// 		if (hasError(error?.response, ErrorCode.NotAuthenticated)) {
// 			setUser(undefined);
// 			return;
// 		}
//
// 		if (!error.response || !error.response.errors) {
// 			handleError(error);
// 		} else {
// 			handleErrors(error.response.errors);
// 		}
// 	}
//
// 	function isAuthorized(roles: Role[]) {
// 		if (!user?.roles) {
// 			return false;
// 		}
//
// 		if (!roles || !Array.isArray(roles)) {
// 			return false;
// 		}
//
// 		for (const userRole of user.roles) {
// 			if (roles.findIndex(role => role === userRole.role) !== -1) {
// 				return true;
// 			}
// 		}
//
// 		return false;
// 	}
//
// 	async function signIn(username?: string, password?: string): Promise<void> {
// 		try {
// 			const result = await gateService.authenticate({username, password, rememberMe: true});
// 			if (result.isSuccess && result.data) {
// 				await mutate(result.data, true);
// 				setShouldRevalidate(true);
// 				return;
// 			}
//
// 			if (result.errors) {
// 				const accountProblemErrors = findErrors(
// 					result,
// 					ErrorCode.EmailAddressWaitingConfirmation,
// 					ErrorCode.AccountWaitingForApproval,
// 					ErrorCode.AccountWasNotApproved,
// 				);
// 				if (accountProblemErrors.length > 0) {
// 					showAlert('Sign In Failed', accountProblemErrors[0].reason);
// 					return;
// 				}
//
// 				handleErrors(result.errors, logger);
// 			}
// 		} catch (error) {
// 			handleError(error as Error, logger);
// 		}
// 	}
//
// 	async function signOut(): Promise<void> {
// 		try {
// 			const result = await gateService.clearSession();
// 			if (result.isSuccess && result.data) {
// 				await mutate(undefined, false);
// 				setShouldRevalidate(false);
// 				return;
// 			}
//
// 			if (result.errors) {
// 				handleErrors(result.errors, logger);
// 			}
// 		} catch (error) {
// 			handleError(error as Error, logger);
// 		}
// 	}
//
// 	useEffect(onDataChanged, [data]);
// 	useEffect(onErrorChanged, [error]);
//
// 	return {isNotAuthenticated, isUserValidating: isValidating, user, isAuthorized, signIn, signOut};
// }
//
// export default useAuthentication;
export {};
