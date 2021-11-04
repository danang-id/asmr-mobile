/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import ProgressContext from './ProgressContext';
// import useLogger from '../hooks/LoggerHook';

function ProgressProvider({children}): JSX.Element {
	// const logger = useLogger(ProgressProvider);
	const [progressInfo, setProgressInfo] = useState({loading: false, percentage: 0});

	function setProgress(loading: boolean, percentage: number = 0) {
		if (percentage <= 0) {
			percentage = 0;
		}
		if (percentage >= 1) {
			percentage = 1;
		}
		setProgressInfo({loading, percentage});
	}

	// useEffect(() => {
	// 	const {loading, percentage} = progressInfo;
	// 	logger.info('Loading:', loading, 'Percentage:', percentage);
	// }, [progressInfo]);

	return <ProgressContext.Provider value={[progressInfo, setProgress]}>{children}</ProgressContext.Provider>;
}

export default ProgressProvider;
