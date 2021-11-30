import {createContext} from 'react';
import ProductionContextInfo from 'asmr/context/ProductionContextInfo';

const ProductionContext = createContext<ProductionContextInfo>({
	list: [],
	ongoing: undefined,
	hasOngoingProduction: () => false,
	start: () => Promise.resolve(undefined),
	finish: () => Promise.resolve(undefined),
	cancel: () => Promise.resolve(undefined),
	refresh: () => Promise.resolve(),
});

export default ProductionContext;
