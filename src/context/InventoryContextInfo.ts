import Bean from 'asmr/core/entities/Bean';
import IncomingGreenBean from 'asmr/core/entities/IncomingGreenBean';

interface InventoryContextInfo {
	beans: Bean[];
	list: IncomingGreenBean[];
	getBeanById(id: string): Bean | undefined;
	stock(beanId: string, greenBeanWeight: number): Promise<Bean | undefined>;
	refresh(): Promise<void>;
}

export default InventoryContextInfo;
