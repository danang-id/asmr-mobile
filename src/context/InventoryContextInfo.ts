import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';

interface InventoryContextInfo {
	beans: Bean[];
	list: IncomingGreenBean[];
	getBeanById(id: string): Bean | undefined;
	getBusinessAnalytics(beanId: string): Promise<StructuredBusinessAnalytics>;
	stock(beanId: string, greenBeanWeight: number): Promise<Bean | undefined>;
	refresh(): Promise<void>;
}

export default InventoryContextInfo;
