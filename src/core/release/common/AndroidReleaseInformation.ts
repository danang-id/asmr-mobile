import AppReleaseInformation from 'asmr/core/release/common/AppReleaseInformation';
import StoreReleaseInformation from 'asmr/core/release/common/StoreReleaseInformation';

interface AndroidReleaseInformation extends AppReleaseInformation {
	PlayStore: StoreReleaseInformation;
}

export default AndroidReleaseInformation;
