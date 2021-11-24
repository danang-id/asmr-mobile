import Bean from '../../core/entities/Bean';
import IncomingGreenBean from '../../core/entities/IncomingGreenBean';

export type InventoryContextInfo = {
	beans: Bean[],
	list: IncomingGreenBean[],
	getBeanById: (id: string) => Bean | undefined,
	stock: (beanId: string, greenBeanWeight: number) => Promise<IncomingGreenBean | undefined>,
	refresh: () => Promise<void>,
};
