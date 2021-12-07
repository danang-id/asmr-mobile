import {useContext} from 'react';
import ProductionContext from 'asmr/context/ProductionContext';

function useProduction() {
	return useContext(ProductionContext);
}

export default useProduction;
