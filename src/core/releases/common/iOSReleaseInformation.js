import AppReleaseInformation from './AppReleaseInformation';
import StoreReleaseInformation from './StoreReleaseInformation';

export default class iOSReleaseInformation extends AppReleaseInformation {
	AppStore: StoreReleaseInformation;
}
