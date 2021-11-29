import GenericReleaseInformation from './GenericReleaseInformation';
import StoreReleaseInformation from './StoreReleaseInformation';

export default class AppReleaseInformation extends GenericReleaseInformation {
	DirectDownload: StoreReleaseInformation;
}
