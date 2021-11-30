import {useContext} from 'react';
import ProductionContext from 'asmr/context/ProductionContext';
import {useInitAsync} from 'asmr/hooks/InitHook';

function useProduction() {
	useInitAsync(onInitAsync);
	const context = useContext(ProductionContext);

	function onInitAsync(): Promise<void> {
		return context.refresh();
	}

	return context;
}

export default useProduction;
