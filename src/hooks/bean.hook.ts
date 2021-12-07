import {useContext} from 'react';
import BeanContext from 'asmr/context/BeanContext';

function useBean() {
	const context = useContext(BeanContext);
	if (!context) {
		throw new Error('BeanProvider has not been registered.');
	}

	return context;
}

export default useBean;
