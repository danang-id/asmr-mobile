import React, {FC, Fragment} from 'react';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import useProgress from '../libs/hooks/ProgressHook';

export type ProgressViewProps = {};

const ProgressView: FC<ProgressViewProps> = ({children}) => {
	const [progress] = useProgress();
	return (
		<Fragment>
			<SpinnerOverlay visible={progress.loading} />
			{children}
		</Fragment>
	);
};

export default ProgressView;
