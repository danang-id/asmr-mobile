import {createContext, Context} from 'react';
import type {ProductionContextInfo} from './ProductionContextInfo';

const ProductionContext: Context<ProductionContextInfo> = createContext({
	list: [],
	ongoing: undefined,
	hasOngoingProduction: () => false,
	start: Promise.resolve(),
	finalize: Promise.resolve(),
	cancel: Promise.resolve(),
	refresh: Promise.resolve(),
});

export default ProductionContext;
