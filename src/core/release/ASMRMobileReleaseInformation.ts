import AndroidReleaseInformation from 'asmr/core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from 'asmr/core/release/common/iOSReleaseInformation';

interface ASMRMobileReleaseInformation {
	Android: AndroidReleaseInformation;
	iOS: iOSReleaseInformation;
}

export default ASMRMobileReleaseInformation;
