import React, {FC, useEffect, useState} from 'react';
import parseEntity from '../common/EntityParser';
import ErrorCode from '../../core/enums/ErrorCode';
import RoastingSession from '../../core/entities/RoastingSession';
import useInit from '../hooks/InitHook';
import useLogger from '../hooks/LoggerHook';
import useServices from '../hooks/ServiceHook';
import ProductionContext from './ProductionContext';
import EntityBase from '../../core/common/EntityBase';

const ProductionProvider: FC = ({children}) => {
	useInit(onInit);
	const logger = useLogger(ProductionProvider);
	const {handleError, handleErrors, bean: beanService, production: productionService} = useServices();

	const [ongoingBean, setOngoingBean] = useState();
	const [ongoingProduction, setOngoingProduction] = useState();
	const [ongoing, setOngoing] = useState();
	const [productionList, setProductionList] = useState([]);

	function onInit(): Promise<void> {
		return refresh();
	}

	function onMyProductionChanged() {
		const ongoingProductionFilter = (r: RoastingSession) => !r.cancelledAt && !r.finishedAt;
		const ongoingProductions = (productionList || []).filter(ongoingProductionFilter);
		if (ongoingProductions.length >= 1) {
			setOngoingProduction(ongoingProductions[0]);
		} else {
			setOngoingProduction();
		}
	}

	function onOngoingProductionChanged() {
		if (!ongoingProduction) {
			setOngoingBean();
			return;
		}

		getBean(ongoingProduction.beanId).catch();
	}

	function onOngoingBeanChanged() {
		if (!ongoingBean) {
			setOngoing();
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

	function start(beanId: string, greenBeanWeight: number): Promise<RoastingSession | undefined> {
		return startProduction(beanId, greenBeanWeight);
	}

	function finalize(roastedBeanWeight: number): Promise<RoastingSession | undefined> {
		return finishProduction(roastedBeanWeight);
	}

	function cancel(): Promise<RoastingSession | undefined> {
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
			handleError(error, logger);
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
			handleError(error, logger);
		}
	}

	async function cancelProduction(isBeanBurnt: boolean = false) {
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
			handleError(error, logger);
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
			handleError(error, logger);
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
			handleError(error, logger);
		}
	}

	function sortList(a: EntityBase, b: EntityBase) {
		return b.createdAt - a.createdAt;
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
