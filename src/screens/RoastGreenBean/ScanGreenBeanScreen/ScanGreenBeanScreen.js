import React, {FC} from 'react';
import {SafeAreaView} from 'react-native';
import {Text} from '@ui-kitten/components';

import ScanGreenBeanScreenStyle from './ScanGreenBeanScreen.style';

const ScanGreenBeanScreen: FC = () => {
	return (
		<SafeAreaView style={ScanGreenBeanScreenStyle.container}>
			<Text>Scan GB</Text>
		</SafeAreaView>
	);
};

export default ScanGreenBeanScreen;
