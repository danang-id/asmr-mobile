import {Text} from '@ui-kitten/components';
import React, {FC} from 'react';
import ReactTimeAgo from 'react-time-ago';

type TimeProps = {
	date: Date;
	verboseDate?: string;
	tooltip: boolean;
};
const Time: FC<TimeProps> = props => {
	const {children} = props;
	return <Text>{children as string}</Text>;
};

export interface TimeAgoProps {
	date: Date | number;
	locale?: string;
}

const TimeAgo: FC<TimeAgoProps> = props => <ReactTimeAgo {...props} component={Time} />;

export default TimeAgo;
