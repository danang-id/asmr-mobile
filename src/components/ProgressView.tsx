import React, {FC, Fragment} from 'react';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import useProgress from 'asmr/hooks/progress.hook';

const ProgressView: FC = ({children}) => {
	const {progress} = useProgress();
	return (
		<Fragment>
			<SpinnerOverlay visible={progress.loading} />
			{children}
		</Fragment>
	);
};

export default ProgressView;
