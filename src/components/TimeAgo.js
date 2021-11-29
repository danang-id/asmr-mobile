import React, {FC} from 'react';
import {Text} from '@ui-kitten/components';
import ReactTimeAgo from 'react-time-ago';

type TimeProps = {
	date: Date,
	verboseDate?: string,
	tooltip: Boolean,
};
const Time: FC<TimeProps> = props => {
	const {date, verboseDate, tooltip, children, ...rest} = props;
	return <Text>{children}</Text>;
};

type UpdateIntervalForStep = {
	threshold?: number,
	interval: number,
};

type TimeAgoProps = {
	date: Date | number,
	future?: boolean,
	timeStyle?: string,
	round?: string,
	minTimeLeft?: number,
	tooltip?: boolean,
	component?: React.ReactNode,
	wrapperComponent?: React.ReactNode,
	wrapperProps?: any,
	locale?: string,
	locales?: string[],
	formatVerboseDate?: (date: Date) => string,
	verboseDateFormat?: object,
	updateInterval?: number | UpdateIntervalForStep[],
	tick?: boolean,
	now?: number,
	timeOffset?: number,
	polyfill?: boolean,
	[otherProperty: string]: any,
};

const TimeAgo: FC<TimeAgoProps> = props => <ReactTimeAgo {...props} component={Time} />;

export default TimeAgo;
