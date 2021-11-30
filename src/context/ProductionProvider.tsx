import React, {FC, useEffect, useState} from 'react';
import ProductionContext from 'asmr/context/ProductionContext';
import {OngoingProductionInfo} from 'asmr/context/ProductionContextInfo';
import EntityBase from 'asmr/core/common/EntityBase';
import Bean from 'asmr/core/entities/Bean';
import Roasting from 'asmr/core/entities/Roasting';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import {useInitAsync} from 'asmr/hooks/InitHook';
import useLogger from 'asmr/hooks/LoggerHook';
import useServices from 'asmr/hooks/ServiceHook';
import {parseEntity} from 'asmr/libs/common/EntityHelper';

const ProductionProvider: FC = ({children}) => {
	useInitAsync(onInitAsync);
	const logger = useLogger(ProductionProvider);
	const {handleError, handleErrors, bean: beanService, production: productionService} = useServices();

	const [ongoingBean, setOngoingBean] = useState<Bean | undefined>();
	const [ongoingProduction, setOngoingProduction] = useState<Roasting | undefined>();
	const [ongoing, setOngoing] = useState<OngoingProductionInfo | undefined>();
	const [productionList, setProductionList] = useState<Roasting[]>([]);

	function onInitAsync(): Promise<void> {
		return refresh();
	}

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

	function finalize(roastedBeanWeight: number): Promise<Roasting | undefined> {
		return finishProduction(roastedBeanWeight);
	}

	function cancel(): Promise<Roasting | undefined> {
		return cancelProduction();
	}

	function refresh(): Promise<void> {
		return getMyProductions();
	}

	async function startProduction(beanId: string, greenBeanWeight: number) {
		try {
			const result = await productionService.start({beanId, greenBeanWeight});
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

	async function finishProduction(roastedBeanWeight: number) {
		if (!ongoingProduction) {
			return;
		}

		try {
			const result = await productionService.finish(ongoingProduction.id, {
				roastedBeanWeight,
			});
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

	async function cancelProduction(isBeanBurnt = false) {
		if (!ongoingProduction) {
			return;
		}

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
				setProductionList(result.data.map(parseEntity).sort(sortList));
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
				setOngoingBean(parseEntity(result.data));
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
			value={{list: productionList, ongoing, hasOngoingProduction, start, finish: finalize, cancel, refresh}}>
			{children}
		</ProductionContext.Provider>
	);
};

export default ProductionProvider;
