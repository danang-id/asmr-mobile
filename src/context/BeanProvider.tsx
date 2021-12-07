import React, {FC} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import Bean from 'asmr/core/entities/Bean';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import BeansResponseModel from 'asmr/core/response/BeansResponseModel';
import usePersistedState from 'asmr/hooks/persisted-state.hook';
import useServices from 'asmr/hooks/service.hook';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';
import {ServiceError} from 'asmr/services/ServiceBase';
import BeanContext from './BeanContext';

const BEANS_KEY = 'BEANS';
const BeanProvider: FC = ({children}) => {
	const services = useServices(BeanProvider);
	const [beans, setBeans] = usePersistedState<Bean[]>(BEANS_KEY, []);

	const queryClient = useQueryClient();

	// <editor-fold desc="Beans Query">
	const onBeansQuerySuccess = async (data: Bean[] | undefined) => {
		setBeans(data);
	};

	const onBeansQueryError = async (error: ServiceError<BeansResponseModel>) => {
		if (error.hasError(ErrorCode.NotAuthenticated)) {
			setBeans([]);
			return;
		}

		if (!error.response || !error.response.errors) {
			services.handleError(error);
		} else {
			services.handleErrors(error.response.errors);
		}
	};

	const beansQuery = useQuery(
		BEANS_KEY,
		async () => {
			const result = await services.bean.getAll();
			return result.data;
		},
		{
			initialData: beans,
			onSuccess: onBeansQuerySuccess,
			onError: onBeansQueryError,
			retry: (failureCount, error) => !error.hasError(ErrorCode.NotAuthenticated),
		},
	);
	// </editor-fold>

	//<editor-fold desc="Get Bean by Id">
	async function getBeanById(beanId: string, queryFromServer = true) {
		if (!queryFromServer) {
			return beans?.find(bean => bean.id === beanId);
		}

		try {
			const result = await services.bean.getById(beanId);
			return result.data;
		} catch (error) {
			if (!(error instanceof ServiceError)) {
				throw error;
			}

			if (error.hasError(ErrorCode.NotAuthenticated)) {
				return;
			}

			if (!error.response || !error.response.errors) {
				services.handleError(error);
			} else {
				services.handleErrors(error.response.errors);
			}
		}
	}
	//</editor-fold>

	//<editor-fold desc="Get Business Analytics by Bean Id">
	async function getBusinessAnalyticsByBeanId(beanId: string) {
		const emptyAnalytics = createStructuredBusinessAnalytics([]);

		try {
			const result = await services.businessAnalytic.getByBeanId(beanId);
			return result.data as StructuredBusinessAnalytics;
		} catch (error) {
			if (!(error instanceof ServiceError)) {
				throw error;
			}

			if (error.hasError(ErrorCode.NotAuthenticated)) {
				return emptyAnalytics;
			}

			if (!error.response || !error.response.errors) {
				services.handleError(error);
			} else {
				services.handleErrors(error.response.errors);
			}
		}

		return emptyAnalytics;
	}
	//</editor-fold>

	//<editor-fold desc="Refresh">
	async function refresh() {
		await queryClient.invalidateQueries(BEANS_KEY);
	}
	//</editor-fold>

	return (
		<BeanContext.Provider
			value={{
				beans: beans ?? [],
				isLoading: beansQuery.isLoading,
				getBeanById,
				getBusinessAnalyticsByBeanId,
				refresh,
			}}>
			{children}
		</BeanContext.Provider>
	);
};

export default BeanProvider;
