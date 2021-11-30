import Bean from 'asmr/core/entities/Bean';
import Roasting from 'asmr/core/entities/Roasting';

export type OngoingProductionInfo = {
	bean: Bean;
	production: Roasting;
};

interface ProductionContextInfo {
	list: Roasting[];
	ongoing?: OngoingProductionInfo;
	hasOngoingProduction(): boolean;
	start(beanId: string, greenBeanWeight: number): Promise<Roasting | undefined>;
	finish(roastedBeanWeight: number): Promise<Roasting | undefined>;
	cancel(): Promise<Roasting | undefined>;
	refresh(): Promise<void>;
}

export default ProductionContextInfo;
