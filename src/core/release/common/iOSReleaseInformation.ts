import AppReleaseInformation from 'asmr/core/release/common/AppReleaseInformation';
import StoreReleaseInformation from 'asmr/core/release/common/StoreReleaseInformation';

interface iOSReleaseInformation extends AppReleaseInformation {
	AppStore: StoreReleaseInformation;
}

export default iOSReleaseInformation;
