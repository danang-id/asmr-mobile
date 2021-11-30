import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import ResponseModelBase from 'asmr/core/common/ResponseModelBase';
import AndroidReleaseInformation from 'asmr/core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from 'asmr/core/release/common/iOSReleaseInformation';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class ReleaseService extends ServiceBase {
	private servicePath = '/api/Release/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = ReleaseService.name;
	}

	public async getMobileReleaseInformation(): Promise<
		ResponseModelBase<AndroidReleaseInformation | iOSReleaseInformation>
	> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + 'mobile');
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default ReleaseService;
