import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Text} from '@ui-kitten/components';
import React, {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import ApplicationLogoImage from 'asmr/components/ApplicationLogoImage';
import ProfilePicture from 'asmr/components/ProfilePicture';
import useAuthentication from 'asmr/hooks/authentication.hook';
import {getGreetingString} from 'asmr/libs/common/Date.helper';
import {RootParamList} from 'asmr/screens/ScreenNavigator';
import ScreenRoutes from 'asmr/screens/ScreenRoutes';
import applicationColors from 'asmr/styles/colors';

export interface DashboardHeaderProps {
	showBorder?: boolean;
	showShadow?: boolean;
	showGreeting?: boolean;
}
const DashboardHeader: FC<DashboardHeaderProps> = props => {
	const {showBorder, showShadow, showGreeting} = props;
	const containerStyles: StyleProp<ViewStyle>[] = [styles.container];
	if (showBorder === true) {
		containerStyles.push(styles.containerBorder);
	}
	if (showShadow === true) {
		containerStyles.push(styles.containerShadow);
	}

	const {user} = useAuthentication();
	const navigation = useNavigation<NavigationProp<RootParamList>>();

	const [greeting, setGreeting] = useState<string>('');
	const mounted = useRef(true);

	const onProfilePicturePressed = useCallback(() => {
		if (!user && !navigation) {
			return;
		}

		navigation.navigate(ScreenRoutes.Account);
	}, [navigation, user]);

	function onUserChanged() {
		if (!user || !mounted.current) {
			return;
		}

		setGreeting(getGreetingString(user.firstName));
	}

	useEffect(() => {
		onUserChanged();
		return () => {
			mounted.current = false;
		};
	}, []);
	useEffect(onUserChanged, [user]);

	return (
		<View style={containerStyles}>
			<View style={styles.headerContent}>
				<ApplicationLogoImage style={styles.applicationLogoImage} />
				{!!user && <ProfilePicture size={50} rounded onPress={onProfilePicturePressed} />}
			</View>
			{showGreeting === true && (
				<View style={styles.greetingContent}>
					<Text style={styles.greetingText}>{greeting}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 15,
		flexDirection: 'column',
	},
	containerBorder: {
		borderBottomWidth: 1,
		borderBottomColor: applicationColors.lightless,
	},
	containerShadow: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,

		elevation: 4,
	},

	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	applicationLogoImage: {
		height: 50,
		width: 145,
	},

	greetingContent: {
		marginTop: 10,
	},
	greetingText: {
		marginLeft: 'auto',
		fontSize: 18,
		fontWeight: '500',
	},
});

export default memo(DashboardHeader);
