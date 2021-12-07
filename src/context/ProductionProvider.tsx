import React, {FC, useEffect, useState} from 'react';
import ProductionContext from 'asmr/context/ProductionContext';
import {OngoingProductionInfo} from 'asmr/context/ProductionContextInfo';
import EntityBase from 'asmr/core/common/EntityBase';
import Bean from 'asmr/core/entities/Bean';
import Roasting from 'asmr/core/entities/Roasting';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import useLogger from 'asmr/hooks/logger.hook';
import usePersistedState from 'asmr/hooks/persisted-state.hook';
import useServices from 'asmr/hooks/service.hook';

const ProductionProvider: FC = ({children}) => {
	const logger = useLogger(ProductionProvider);
	const {
		handleError,
		handleErrors,
		bean: beanService,
		production: productionService,
	} = useServices(ProductionProvider);

	const [ongoingBean, setOngoingBean] = useState<Bean | undefined>();
	const [ongoingProduction, setOngoingProduction] = useState<Roasting | undefined>();
	const [ongoing, setOngoing] = useState<OngoingProductionInfo | undefined>();
	const [productionList, setProductionList] = usePersistedState<Roasting[]>('ROASTINGS', []);

	function onMyProductionChanged() {
		const ongoingProductionFilter = (r: Roasting) => !r.cancelledAt && !r.finishedAt;
		const ongoingProductions = (productionList || []).filter(ongoingProductionFilter);
		if (ongoingProductions.length >= 1) {
			setOngoingProduction(ongoingProductions[0]);
		} else {
			setOngoingProduction(undefined);
		}
	}

	function onOngoingProductionChanged() {
		if (!ongoingProduction) {
			setOngoingBean(undefined);
			return;
		}

		getBean(ongoingProduction.beanId).catch();
	}

	function onOngoingBeanChanged() {
		if (!ongoingBean || !ongoingProduction) {
			setOngoing(undefined);
			return;
		}

		setOngoing({
			bean: ongoingBean,
			production: ongoingProduction,
		});
	}

	function hasOngoingProduction() {
		return !!ongoing && !!ongoingBean && !!ongoingProduction;
	}

	function start(beanId: string, greenBeanWeight: number): Promise<Roasting | undefined> {
		return startProduction(beanId, greenBeanWeight);
	}

	function finish(roastedBeanWeight: number): Promise<Roasting | undefined> {
		return finishProduction(roastedBeanWeight);
	}

	function cancel(isBeanBurnt = false): Promise<Roasting | undefined> {
		return cancelProduction(isBeanBurnt);
	}

	function refresh(): Promise<void> {
		logger.info('Data refresh requested');
		return getMyProductions();
	}

	async function startProduction(beanId: string, greenBeanWeight: number) {
		logger.info('Start production requested');

		try {
			const result = await productionService.start({beanId, greenBeanWeight});
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

	async function finishProduction(roastedBeanWeight: number) {
		if (!ongoingProduction) {
			return;
		}

		logger.info('Finish production requested');

		try {
			const result = await productionService.finish(ongoingProduction.id, {
				roastedBeanWeight,
			});
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

	async function cancelProduction(isBeanBurnt = false) {
		if (!ongoingProduction) {
			return;
		}

		logger.info('Cancel production requested');

		try {
			const result = await productionService.cancel(ongoingProduction.id, isBeanBurnt);
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

	async function getMyProductions() {
		try {
			const result = await productionService.getAll(true, true);
			if (result.isSuccess && result.data) {
				setProductionList(result.data.sort(sortList));
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

	async function getBean(beanId: string) {
		try {
			const result = await beanService.getById(beanId);
			if (result.isSuccess && result.data) {
				setOngoingBean(result.data);
				return;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	function sortList(a: EntityBase, b: EntityBase) {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	}

	useEffect(onMyProductionChanged, [productionList]);
	useEffect(onOngoingProductionChanged, [ongoingProduction]);
	useEffect(onOngoingBeanChanged, [ongoingBean]);

	return (
		<ProductionContext.Provider
			value={{
				list: productionList ?? [],
				ongoing,
				hasOngoingProduction,
				start,
				finish,
				cancel,
				refresh,
			}}>
			{children}
		</ProductionContext.Provider>
	);
};

export default ProductionProvider;
