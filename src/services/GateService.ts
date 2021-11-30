import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import SignInRequestModel from 'asmr/core/request/SignInRequestModel';
import AuthenticationResponseModel from 'asmr/core/response/AuthenticationResponseModel';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class GateService extends ServiceBase {
	private servicePath = '/api/Gate/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = GateService.name;
	}

	public async authenticate(body: SignInRequestModel): Promise<AuthenticationResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'authenticate', body);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async clearSession(): Promise<AuthenticationResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'exit');
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async getUserPassport(): Promise<AuthenticationResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + 'passport');
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default GateService;
