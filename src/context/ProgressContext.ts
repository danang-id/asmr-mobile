import {createContext} from 'react';
import ProgressContextInfo from './ProgressContextInfo';

const ProgressContext = createContext<ProgressContextInfo>({
	progress: {loading: false, percentage: 0},
	setProgress() {
		return;
	},
});

export default ProgressContext;
