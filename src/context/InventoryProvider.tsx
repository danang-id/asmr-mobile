import React, {FC} from 'react';
import InventoryContext from 'asmr/context/InventoryContext';
import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import useLogger from 'asmr/hooks/logger.hook';
import usePersistedState from 'asmr/hooks/persisted-state.hook';
import useServices from 'asmr/hooks/service.hook';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';
import {createEntitiesSorter} from 'asmr/libs/common/Entity.helper';

const InventoryProvider: FC = ({children}) => {
	const logger = useLogger(InventoryProvider);
	const {
		handleError,
		handleErrors,
		bean: beanService,
		businessAnalytic: businessAnalyticService,
		incomingGreenBean: incomingGreenBeanService,
	} = useServices(InventoryProvider);

	const [beanList, setBeanList] = usePersistedState<Bean[]>('BEANS', []);
	const [incomingGreenBeanList, setIncomingGreenBeanList] = usePersistedState<IncomingGreenBean[]>(
		'INCOMING_GREEN_BEANS',
		[],
	);

	function getBeanById(id: string): Bean | undefined {
		return (beanList || []).find((bean: Bean) => bean.id === id);
	}

	function stock(beanId: string, greenBeanWeight: number): Promise<Bean | undefined> {
		return createStock(beanId, greenBeanWeight);
	}

	async function refresh(): Promise<void> {
		logger.info('Data refresh requested');
		await Promise.all([getBeans(), getMyStocks()]);
	}

	async function createStock(beanId: string, weight: number): Promise<Bean | undefined> {
		logger.info('Create stock requested');

		try {
			const result = await incomingGreenBeanService.create(beanId, {weight});
			if (result.isSuccess && result.data) {
				await refresh();
				return result.data;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	async function getBeans(): Promise<void> {
		logger.info('Get beans requested');

		try {
			const result = await beanService.getAll();
			if (result.isSuccess && result.data) {
				setBeanList(result.data);
			}

			if (result.errors && Array.isArray(result.errors)) {
				const unauthenticatedError = result.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					handleErrors(result.errors, logger);
				}
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	async function getBusinessAnalytics(beanId: string): Promise<StructuredBusinessAnalytics> {
		logger.info('Get business analytics requested');

		try {
			const result = await businessAnalyticService.getByBeanId(beanId);
			if (result.isSuccess && result.data) {
				return result.data;
			}

			if (result.errors && Array.isArray(result.errors)) {
				const unauthenticatedError = result.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					handleErrors(result.errors, logger);
				}
			}
		} catch (error) {
			handleError(error as Error, logger);
		}

		return createStructuredBusinessAnalytics([]);
	}

	async function getMyStocks(): Promise<void> {
		logger.info('Get my stocks requested');

		try {
			const result = await incomingGreenBeanService.getAll(true);
			if (result.isSuccess && result.data) {
				setIncomingGreenBeanList(result.data.sort(createEntitiesSorter()));
			}

			if (result.errors && Array.isArray(result.errors)) {
				const unauthenticatedError = result.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					handleErrors(result.errors, logger);
				}
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	return (
		<InventoryContext.Provider
			value={{
				beans: beanList ?? [],
				list: incomingGreenBeanList ?? [],
				getBeanById,
				getBusinessAnalytics,
				stock,
				refresh,
			}}>
			{children}
		</InventoryContext.Provider>
	);
};

export default InventoryProvider;
