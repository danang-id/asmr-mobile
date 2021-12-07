import ResponseModelBase from 'asmr/core/common/ResponseModelBase';
import AndroidReleaseInformation from 'asmr/core/release/common/AndroidReleaseInformation';
import iOSReleaseInformation from 'asmr/core/release/common/iOSReleaseInformation';
import ServiceBase, {ServiceParameters} from 'asmr/services/ServiceBase';

class ReleaseService extends ServiceBase {
	private servicePath = '/api/release/';

	constructor(parameters: ServiceParameters) {
		super(parameters);
		super.tag = ReleaseService.name;
	}

	public async getMobileReleaseInformation(): Promise<
		ResponseModelBase<AndroidReleaseInformation | iOSReleaseInformation>
	> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + 'mobile');
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}
}

export default ReleaseService;
