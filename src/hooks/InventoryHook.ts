import {useContext} from 'react';
import InventoryContext from 'asmr/context/InventoryContext';
import {useInitAsync} from 'asmr/hooks/InitHook';

function useInventory() {
	useInitAsync(onInitAsync);
	const context = useContext(InventoryContext);

	function onInitAsync(): Promise<void> {
		return context.refresh();
	}

	return context;
}

export default useInventory;
