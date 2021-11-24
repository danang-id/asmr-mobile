import {createContext, Context} from 'react';
import type {InventoryContextInfo} from './InventoryContextInfo';

const InventoryContext: Context<InventoryContextInfo> = createContext({
	beans: [],
	list: [],
	getBeanById: () => {},
	stock: Promise.resolve(),
	refresh: Promise.resolve(),
});

export default InventoryContext;
