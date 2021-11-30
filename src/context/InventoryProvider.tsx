import React, {FC, useState} from 'react';
import InventoryContext from 'asmr/context/InventoryContext';
import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useServices from 'asmr/hooks/ServiceHook';
import {parseEntity, createEntitiesSorter} from 'asmr/libs/common/EntityHelper';

const InventoryProvider: FC = ({children}) => {
	useInitAsync(onInitAsync);
	const logger = useLogger(InventoryProvider);
	const {handleError, handleErrors, bean: beanService, incomingGreenBean: incomingGreenBeanService} = useServices();

	const [beanList, setBeanList] = useState<Bean[]>([]);
	const [incomingGreenBeanList, setIncomingGreenBeanList] = useState<IncomingGreenBean[]>([]);

	function onInitAsync(): Promise<void> {
		return refresh();
	}

	function getBeanById(id: string): Bean | undefined {
		return (beanList || []).find((bean: Bean) => bean.id === id);
	}

	function stock(beanId: string, greenBeanWeight: number): Promise<Bean | undefined> {
		return createStock(beanId, greenBeanWeight);
	}

	async function refresh(): Promise<void> {
		await Promise.all([getBeans(), getMyStocks()]);
	}

	async function createStock(beanId: string, weight: number): Promise<Bean | undefined> {
		try {
			const result = await incomingGreenBeanService.create(beanId, {weight});
			if (result.isSuccess && result.data) {
				await refresh();
				return parseEntity(result.data);
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	async function getBeans(): Promise<void> {
		try {
			const result = await beanService.getAll();
			if (result.isSuccess && result.data) {
				setBeanList(result.data.map(parseEntity));
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

	async function getMyStocks(): Promise<void> {
		try {
			const result = await incomingGreenBeanService.getAll(true);
			if (result.isSuccess && result.data) {
				setIncomingGreenBeanList(result.data.map(parseEntity).sort(createEntitiesSorter()));
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
		<InventoryContext.Provider value={{beans: beanList, list: incomingGreenBeanList, getBeanById, stock, refresh}}>
			{children}
		</InventoryContext.Provider>
	);
};

export default InventoryProvider;
