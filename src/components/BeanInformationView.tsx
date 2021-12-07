import {API_BASE_URL} from '@env';
import {Card, Text} from '@ui-kitten/components';
import React, {FC, Fragment, memo, useState} from 'react';
import {
	ActivityIndicator,
	Dimensions,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	ScrollViewProps,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import CardHeader from 'asmr/components/CardHeader';
import ImageViewer from 'asmr/components/ImageViewer';
import Bean from 'asmr/core/entities/Bean';
import applicationColors from 'asmr/styles/colors';

interface BeanInformationProps extends ScrollViewProps {
	bean?: Bean;
	useKeyboardAvoidingView?: boolean;
}
const BeanInformationView: FC<BeanInformationProps> = props => {
	const {bean, children, useKeyboardAvoidingView, ...rest} = props;

	const [imageViewerShown, setImageViewerShown] = useState<boolean>(false);

	function onImagePressed() {
		setImageViewerShown(true);
	}

	function onImageViewerClosed() {
		setImageViewerShown(false);
	}

	if (!bean) {
		return (
			<SafeAreaView style={styles.loadingView}>
				<ActivityIndicator />
				<Text style={styles.loadingText}>Getting bean information...</Text>
			</SafeAreaView>
		);
	}

	if (!useKeyboardAvoidingView) {
		return (
			<Fragment>
				<ImageViewer
					uri={API_BASE_URL + bean?.image ?? ''}
					visible={imageViewerShown}
					onClose={onImageViewerClosed}
					title={bean.name}
				/>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollViewContentContainer}
					{...rest}>
					<TouchableOpacity onPress={onImagePressed}>
						<FastImage
							style={styles.beanImage}
							resizeMode={FastImage.resizeMode.cover}
							source={{uri: API_BASE_URL + bean.image}}
						/>
					</TouchableOpacity>

					<Card
						style={styles.beanCard}
						header={<CardHeader title={bean.name} />}
						appearance="filled"
						status="primary">
						<Text category="p1">{bean.description}</Text>
					</Card>

					{children}
				</ScrollView>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<ImageViewer
				uri={API_BASE_URL + bean.image}
				visible={imageViewerShown}
				onClose={onImageViewerClosed}
				title={bean.name}
			/>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer} {...rest}>
				<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="position">
					<TouchableOpacity onPress={onImagePressed}>
						<FastImage
							style={styles.beanImage}
							resizeMode={FastImage.resizeMode.cover}
							source={{uri: API_BASE_URL + bean.image}}
						/>
					</TouchableOpacity>

					<Card
						style={styles.beanCard}
						header={<CardHeader title={bean.name} />}
						appearance="filled"
						status="primary">
						<Text category="p1">{bean.description}</Text>
					</Card>

					{children}
				</KeyboardAvoidingView>
			</ScrollView>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	loadingView: {
		flex: 1,
		padding: 15,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingText: {
		marginTop: 10,
		marginHorizontal: 20,
		textAlign: 'center',
	},

	scrollView: {},
	scrollViewContentContainer: {},

	keyboardAvoidingView: {},

	beanImage: {
		aspectRatio: 3 / 2,
		width: '100%',
		height: 'auto',
		borderBottomWidth: 1,
		borderBottomColor: applicationColors.lightless,
	},
	beanImageBase: {
		width: '100%',
		height: Dimensions.get('window').width * (2 / 3),
	},

	beanCard: {
		borderRadius: 0,
	},
});

export default memo(BeanInformationView);
