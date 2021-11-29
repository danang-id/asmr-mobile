import React, {FC, useEffect, useState} from 'react';
import ErrorCode from '../../core/enums/ErrorCode';
import Bean from '../../core/entities/Bean';
import IncomingGreenBean from '../../core/entities/IncomingGreenBean';
import useInit from '../hooks/InitHook';
import useLogger from '../hooks/LoggerHook';
import useServices from '../hooks/ServiceHook';
import InventoryContext from './InventoryContext';
import parseEntity from '../common/EntityParser';
import EntityBase from '../../core/common/EntityBase';

const InventoryProvider: FC = ({children}) => {
	useInit(onInit);
	const logger = useLogger(InventoryProvider);
	const {handleError, handleErrors, bean: beanService, incomingGreenBean: incomingGreenBeanService} = useServices();

	const [beanList, setBeanList] = useState([]);
	const [incomingGreenBeanList, setIncomingGreenBeanList] = useState([]);

	function onInit(): Promise<void> {
		return refresh();
	}

	function getBeanById(id: string): Bean | undefined {
		return (beanList || []).find((bean: Bean) => bean.id === id);
	}

	function stock(beanId: string, greenBeanWeight: number): Promise<IncomingGreenBean | undefined> {
		return createStock(beanId, greenBeanWeight);
	}

	function refresh(): Promise<void> {
		return Promise.all([getBeans(), getMyStocks()]);
	}

	async function createStock(beanId: string, weight: number) {
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
			handleError(error, logger);
		}
	}

	async function getBeans() {
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
			handleError(error, logger);
		}
	}

	async function getMyStocks() {
		try {
			const result = await incomingGreenBeanService.getAll(true);
			if (result.isSuccess && result.data) {
				setIncomingGreenBeanList(result.data.map(parseEntity).sort(sortList));
			}

			if (result.errors && Array.isArray(result.errors)) {
				const unauthenticatedError = result.errors.find(error => error.code === ErrorCode.NotAuthenticated);
				if (!unauthenticatedError) {
					handleErrors(result.errors, logger);
				}
			}
		} catch (error) {
			handleError(error, logger);
		}
	}

	function sortList(a: EntityBase, b: EntityBase) {
		return b.createdAt - a.createdAt;
	}

	return (
		<InventoryContext.Provider value={{beans: beanList, list: incomingGreenBeanList, getBeanById, stock, refresh}}>
			{children}
		</InventoryContext.Provider>
	);
};

export default InventoryProvider;
