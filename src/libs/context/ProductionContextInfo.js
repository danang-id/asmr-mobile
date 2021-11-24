import Bean from '../../core/entities/Bean';
import RoastedBeanProduction from '../../core/entities/RoastedBeanProduction';

export type OngoingProductionInfo = {
	bean: Bean,
	production: RoastedBeanProduction,
};

export type ProductionContextInfo = {
	list: RoastedBeanProduction[],
	ongoing?: OngoingProductionInfo,
	hasOngoingProduction: () => boolean,
	start: (beanId: string, greenBeanWeight: number) => Promise<RoastedBeanProduction | undefined>,
	finalize: (roastedBeanWeight: number) => Promise<RoastedBeanProduction | undefined>,
	cancel: () => Promise<RoastedBeanProduction | undefined>,
	refresh: () => Promise<void>,
};
