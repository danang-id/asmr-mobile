import {useContext} from 'react';
import ProductionContext from '../context/ProductionContext';

function useProduction() {
	return useContext(ProductionContext);
}

export default useProduction;
