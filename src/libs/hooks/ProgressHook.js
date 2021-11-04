import {useContext} from 'react';
import ProgressContext from '../context/ProgressContext';

function useProgress() {
	return useContext(ProgressContext);
}

export default useProgress;
