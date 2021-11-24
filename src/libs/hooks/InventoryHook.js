import {useContext} from 'react';
import InventoryContext from '../context/InventoryContext';

function useInventory() {
	return useContext(InventoryContext);
}

export default useInventory;
