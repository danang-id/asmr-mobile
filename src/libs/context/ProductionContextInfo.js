import Bean from '../../core/entities/Bean';
import RoastingSession from '../../core/entities/RoastingSession';

export type OngoingProductionInfo = {
	bean: Bean,
	production: RoastingSession,
};

export type ProductionContextInfo = {
	list: RoastingSession[],
	ongoing?: OngoingProductionInfo,
	hasOngoingProduction: () => boolean,
	start: (beanId: string, greenBeanWeight: number) => Promise<RoastingSession | undefined>,
	finish: (roastedBeanWeight: number) => Promise<RoastingSession | undefined>,
	cancel: () => Promise<RoastingSession | undefined>,
	refresh: () => Promise<void>,
};
