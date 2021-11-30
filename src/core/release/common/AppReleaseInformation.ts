import GenericReleaseInformation from 'asmr/core/release/common/GenericReleaseInformation';
import StoreReleaseInformation from 'asmr/core/release/common/StoreReleaseInformation';

interface AppReleaseInformation extends GenericReleaseInformation {
	DirectDownload: StoreReleaseInformation;
}

export default AppReleaseInformation;
