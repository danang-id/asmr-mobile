import {Alert, Linking, Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';
import compareVersions from 'compare-versions';
import useLogger from './LoggerHook';
import useServices from './ServiceHook';

function useUpdateChecker() {
	const logger = useLogger('UpdateChecker');
	const {handleError, handleErrors, release: releaseService} = useServices();
	return async () => {
		try {
			const currentVersion = getVersion();
			const result = await releaseService.getMobileReleaseInformation();
			if (result.isSuccess && result.data) {
				let latestVersion: string | undefined;
				let updateLink: string | undefined;
				if (Platform.OS === 'android') {
					latestVersion = result.data.Android.Version;
					if (result.data.Android.PlayStore.Available) {
						updateLink = result.data.Android.PlayStore.Link;
					} else if (result.data.Android.DirectDownload.Available) {
						updateLink = result.data.Android.DirectDownload.Link;
					}
				} else if (Platform.OS === 'ios') {
					latestVersion = result.data.iOS.Version;
					if (result.data.iOS.AppStore.Available) {
						updateLink = result.data.iOS.AppStore.Link;
					} else if (result.data.iOS.DirectDownload.Available) {
						updateLink = result.data.iOS.DirectDownload.Link;
					}
				}

				if (compareVersions(latestVersion, currentVersion) === 1 && !!updateLink) {
					logger.info('Update Available', `current v${currentVersion}`, `latest v${latestVersion}`);
					Alert.alert('Update Available', 'An update for asmr is available to download.', [
						{
							style: 'destructive',
							text: 'Remind me later',
							onPress: () => {
								logger.info('Update ignored by user');
							},
						},
						{
							style: 'default',
							text: 'Update Now',
							onPress: () => {
								Linking.canOpenURL(updateLink).then(supported => {
									if (supported) {
										logger.info('Opening update link', updateLink);
										return Linking.openURL(updateLink);
									} else {
										logger.info('Failed to open update link', updateLink);
										Alert.alert(`Failed to open ${updateLink}.`);
									}
								});
							},
						},
					]);
				}

				logger.info(`Using the latest version available: v${currentVersion}`);
				return;
			}

			if (result.errors) {
				handleErrors(result.errors, logger, {showAlert: false, showLog: true});
			}
		} catch (error) {
			handleError(error, logger, {showAlert: false, showLog: true});
		}
	};
}

export default useUpdateChecker;
