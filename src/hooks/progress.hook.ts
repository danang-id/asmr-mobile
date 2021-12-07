import {useContext} from 'react';
import ProgressContext from 'asmr/context/ProgressContext';

function useProgress() {
	return useContext(ProgressContext);
}

export default useProgress;
