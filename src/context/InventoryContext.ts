import {createContext} from 'react';
import InventoryContextInfo from 'asmr/context/InventoryContextInfo';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';

const InventoryContext = createContext<InventoryContextInfo>({
	beans: [],
	list: [],
	getBeanById() {
		return undefined;
	},
	getBusinessAnalytics(): Promise<StructuredBusinessAnalytics> {
		return Promise.resolve(createStructuredBusinessAnalytics([]));
	},
	stock() {
		return Promise.resolve(undefined);
	},
	refresh() {
		return Promise.resolve();
	},
});

export default InventoryContext;
