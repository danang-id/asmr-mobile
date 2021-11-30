import {createContext} from 'react';
import InventoryContextInfo from 'asmr/context/InventoryContextInfo';

const InventoryContext = createContext<InventoryContextInfo>({
	beans: [],
	list: [],
	getBeanById() {
		return undefined;
	},
	stock() {
		return Promise.resolve(undefined);
	},
	refresh() {
		return Promise.resolve();
	},
});

export default InventoryContext;
