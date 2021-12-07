import React, {FC, useEffect, useState} from 'react';
import ProgressContext from 'asmr/context/ProgressContext';
import useLogger from 'asmr/hooks/logger.hook';
import usePrevious from 'asmr/hooks/previous.hook';

const ProgressLogConfig = {
	useLog: false,
	logLoading: true,
	logPercentage: false,
};

const ProgressProvider: FC = ({children}) => {
	const logger = useLogger(ProgressProvider);
	const [progress, setInternalProgress] = useState({loading: false, percentage: 0});
	const prevProgress = usePrevious(progress);

	function setProgress(loading: boolean, percentage = 0) {
		if (percentage <= 0) {
			percentage = 0;
		}
		if (percentage >= 1) {
			percentage = 1;
		}
		setInternalProgress({loading, percentage});
	}

	function onProgressInfoChanged() {
		if (!ProgressLogConfig.useLog) {
			return;
		}

		if (ProgressLogConfig.logLoading && progress?.loading !== prevProgress?.loading) {
			logger.info(progress.loading ? 'Loading Started' : 'Loading Finished');
		}
		if (
			ProgressLogConfig.logPercentage &&
			progress.percentage !== prevProgress?.percentage &&
			progress.percentage > 0 &&
			progress.percentage < 1
		) {
			logger.info(progress.percentage * 100 + '% loaded');
		}
	}

	useEffect(onProgressInfoChanged, [progress]);

	return <ProgressContext.Provider value={{progress, setProgress}}>{children}</ProgressContext.Provider>;
};

export default ProgressProvider;
