import {Alert, Linking, Platform} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import compareVersions from 'compare-versions';
import useLogger from './LoggerHook';
import useServices from './ServiceHook';
import AndroidReleaseInformation from '../../core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from '../../core/release/common/iOSReleaseInformation';

function useUpdateChecker() {
	const logger = useLogger('UpdateChecker');
	const {handleError, handleErrors, release: releaseService} = useServices();
	return async () => {
		try {
			const currentVersionCode = parseInt(getBuildNumber(), 10);
			const currentVersion = getVersion();
			const result = await releaseService.getMobileReleaseInformation();
			if (result.isSuccess && result.data) {
				const latestVersionCode = result.data.VersionCode;
				const latestVersion = result.data.Version;
				let updateLink: string | undefined;
				if (Platform.OS === 'android') {
					const data: AndroidReleaseInformation = result.data;
					if (data.PlayStore.Available) {
						updateLink = data.PlayStore.Link;
					} else if (data.DirectDownload.Available) {
						updateLink = data.DirectDownload.Link;
					}
				} else if (Platform.OS === 'ios') {
					const data: iOSReleaseInformation = result.data;
					if (data.AppStore.Available) {
						updateLink = data.AppStore.Link;
					} else if (data.DirectDownload.Available) {
						updateLink = data.DirectDownload.Link;
					}
				}

				function askToUpdate() {
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

				const hasUpdateLink = !!updateLink;
				const hasHigherVersion = compareVersions(latestVersion, currentVersion) === 1;
				const hasHigherVersionCode = !isNaN(currentVersionCode) && latestVersionCode > currentVersionCode;

				if (hasUpdateLink) {
					logger.info('Update available', `current v${currentVersion}`, `latest v${latestVersion}`);
					if (hasHigherVersion) {
						askToUpdate();
					} else if (hasHigherVersionCode) {
						askToUpdate();
					}

					return;
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
