import React, {FC} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import AuthenticationContext from 'asmr/context/AuthenticationContext';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import User from 'asmr/core/entities/User';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import Role from 'asmr/core/enums/Role';
import SignInRequestModel from 'asmr/core/request/SignInRequestModel';
import AuthenticationResponseModel from 'asmr/core/response/AuthenticationResponseModel';
import StructuredBusinessAnalyticsResponseModel from 'asmr/core/response/StructuredBusinessAnalyticsResponseModel';
import usePersistedState from 'asmr/hooks/persisted-state.hook';
import useServices from 'asmr/hooks/service.hook';
import {ServiceError} from 'asmr/services/ServiceBase';

const AUTHENTICATED_USER_KEY = 'AUTHENTICATED_USER';
const AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY = 'AUTHENTICATED_USER_BUSINESS_ANALYTICS';
const AuthenticationProvider: FC = ({children}) => {
	const services = useServices(AuthenticationProvider);
	const [user, setUser] = usePersistedState<User>(AUTHENTICATED_USER_KEY);
	const [businessAnalytics, setBusinessAnalytics] = usePersistedState<StructuredBusinessAnalytics>(
		AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY,
	);

	const queryClient = useQueryClient();

	// <editor-fold desc="Business Analytics Query">
	const onBusinessAnalyticsQuerySuccess = async (data: StructuredBusinessAnalytics | undefined) => {
		setBusinessAnalytics(data);
	};

	const onBusinessAnalyticsQueryError = async (error: ServiceError<StructuredBusinessAnalyticsResponseModel>) => {
		if (error.hasError(ErrorCode.NotAuthenticated)) {
			setBusinessAnalytics(undefined);
			return;
		}

		if (!error.response || !error.response.errors) {
			services.handleError(error);
		} else {
			services.handleErrors(error.response.errors);
		}
	};

	const businessAnalyticsQuery = useQuery(
		AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY,
		async () => {
			const result = await services.businessAnalytic.getMine();
			return result.data;
		},
		{
			initialData: businessAnalytics,
			onSuccess: onBusinessAnalyticsQuerySuccess,
			onError: onBusinessAnalyticsQueryError,
			retry: (failureCount, error) => !error.hasError(ErrorCode.NotAuthenticated),
		},
	);
	// </editor-fold>

	// <editor-fold desc="User Query">
	const onUserQuerySuccess = async (data: User | undefined) => {
		setUser(data);
	};

	const onUserQueryError = async (error: ServiceError<AuthenticationResponseModel>) => {
		if (error.hasError(ErrorCode.NotAuthenticated)) {
			setUser(undefined);
			return;
		}

		if (!error.response || !error.response.errors) {
			services.handleError(error);
		} else {
			services.handleErrors(error.response.errors);
		}
	};

	const userQuery = useQuery(
		AUTHENTICATED_USER_KEY,
		async () => {
			const result = await services.gate.getUserPassport();
			return result.data;
		},
		{
			initialData: user,
			onSuccess: onUserQuerySuccess,
			onError: onUserQueryError,
			retry: (failureCount, error) => !error.hasError(ErrorCode.NotAuthenticated),
		},
	);
	// </editor-fold>

	// <editor-fold desc="Sign In Mutation">
	const onSignInSuccess = async (data: User | undefined) => {
		setUser(data);
		await queryClient.invalidateQueries(AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY);
	};

	const onSignInError = (error: ServiceError<AuthenticationResponseModel>) => {
		if (error.hasError(ErrorCode.NotAuthenticated)) {
			setUser(undefined);
			return;
		}

		if (!error.response || !error.response.errors) {
			services.handleError('Sign In', error);
		} else {
			services.handleErrors('Sign In', error.response.errors);
		}
	};

	const signInRequest = async (model: SignInRequestModel) => {
		const result = await services.gate.authenticate(model);
		return result.data;
	};
	const signInQuery = useMutation(signInRequest, {
		onSuccess: onSignInSuccess,
		onError: onSignInError,
	});

	async function signIn(username: string, password: string) {
		try {
			await signInQuery.mutateAsync({username, password});
		} catch (error) {
			// Do nothing
		}
	}
	// </editor-fold>

	// <editor-fold desc="Sign Out Mutation">
	const onSignOutSuccess = async (data: User | undefined) => {
		setUser(undefined);
		await queryClient.invalidateQueries(AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY);
	};

	const onSignOutError = (error: ServiceError<AuthenticationResponseModel>) => {
		if (!error.response || !error.response.errors) {
			services.handleError('Sign Out', error);
		} else {
			services.handleErrors('Sign Out', error.response.errors);
		}
	};

	const signOutRequest = async () => {
		const result = await services.gate.clearSession();
		return result.data;
	};
	const signOutQuery = useMutation(signOutRequest, {
		onSuccess: onSignOutSuccess,
		onError: onSignOutError,
	});

	async function signOut() {
		try {
			await signOutQuery.mutateAsync();
		} catch (error) {
			// Do nothing
		}
	}
	// </editor-fold>

	//<editor-fold desc="Authorization">
	function isAuthorized(roles: Role[]) {
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
	//</editor-fold>

	//<editor-fold desc="Refresh">
	async function refresh() {
		await Promise.all([
			queryClient.invalidateQueries(AUTHENTICATED_USER_KEY),
			queryClient.invalidateQueries(AUTHENTICATED_USER_BUSINESS_ANALYTICS_KEY),
		]);
	}
	//</editor-fold>

	return (
		<AuthenticationContext.Provider
			value={{
				businessAnalytics,
				user,
				isAuthenticated: !!user,
				isBusinessAnalyticsLoading: businessAnalyticsQuery.isLoading,
				isUserLoading: userQuery.isLoading,
				isAuthorized,
				refresh,
				signIn,
				signOut,
			}}>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default AuthenticationProvider;
