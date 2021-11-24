import React, {FC, useEffect, useState} from 'react';
import ProgressContext from './ProgressContext';
import useLogger from '../hooks/LoggerHook';
import usePrevious from '../hooks/PreviousHook';

const ProgressLogConfig = {
	useLog: false,
	logLoading: true,
	logPercentage: false,
};

const ProgressProvider: FC = ({children}) => {
	const logger = useLogger(ProgressProvider);
	const [progressInfo, setProgressInfo] = useState({loading: false, percentage: 0});
	const prevProgressInfo = usePrevious(progressInfo);

	function setProgress(loading: boolean, percentage: number = 0) {
		if (percentage <= 0) {
			percentage = 0;
		}
		if (percentage >= 1) {
			percentage = 1;
		}
		setProgressInfo({loading, percentage});
	}

	function onProgressInfoChanged() {
		if (!ProgressLogConfig.useLog) {
			return;
		}

		if (ProgressLogConfig.logLoading && progressInfo?.loading !== prevProgressInfo?.loading) {
			logger.info(progressInfo.loading ? 'Loading Started' : 'Loading Finished');
		}
		if (
			ProgressLogConfig.logPercentage &&
			progressInfo.percentage !== prevProgressInfo?.percentage &&
			progressInfo.percentage > 0 &&
			progressInfo.percentage < 1
		) {
			logger.info(progressInfo.percentage * 100 + '% loaded');
		}
	}

	useEffect(onProgressInfoChanged, [progressInfo]);

	return <ProgressContext.Provider value={[progressInfo, setProgress]}>{children}</ProgressContext.Provider>;
};

export default ProgressProvider;
