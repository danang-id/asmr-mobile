import {useContext} from 'react';
import InventoryContext from 'asmr/context/InventoryContext';

function useInventory() {
	return useContext(InventoryContext);
}

export default useInventory;
