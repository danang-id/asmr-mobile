import compareVersions from 'compare-versions';
import {Alert, Linking, Platform} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import AndroidReleaseInformation from 'asmr/core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from 'asmr/core/release/common/iOSReleaseInformation';
import useLogger from 'asmr/hooks/logger.hook';
import useServices from 'asmr/hooks/service.hook';

const TAG = 'UpdateChecker';
function useUpdateChecker() {
	const logger = useLogger(TAG);
	const {handleError, handleErrors, release: releaseService} = useServices(TAG);

	function askToUpdate(updateLink: string) {
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
					const data = result.data as AndroidReleaseInformation;
					if (data.PlayStore.Available) {
						updateLink = data.PlayStore.Link;
					} else if (data.DirectDownload.Available) {
						updateLink = data.DirectDownload.Link;
					}
				} else if (Platform.OS === 'ios') {
					const data = result.data as iOSReleaseInformation;
					if (data.AppStore.Available) {
						updateLink = data.AppStore.Link;
					} else if (data.DirectDownload.Available) {
						updateLink = data.DirectDownload.Link;
					}
				}

				const hasUpdateLink = !!updateLink;
				const hasHigherVersion = compareVersions(latestVersion, currentVersion) === 1;
				const hasHigherVersionCode = !isNaN(currentVersionCode) && latestVersionCode > currentVersionCode;

				if (hasUpdateLink) {
					logger.info('Update available', `current v${currentVersion}`, `latest v${latestVersion}`);
					if (hasHigherVersion) {
						askToUpdate(updateLink ?? '');
					} else if (hasHigherVersionCode) {
						askToUpdate(updateLink ?? '');
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
			handleError(error as Error, logger, {showAlert: false, showLog: true});
		}
	};
}

export default useUpdateChecker;
