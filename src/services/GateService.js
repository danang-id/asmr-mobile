import {CancelTokenSource} from 'axios';
import SignInRequestModel from '../core/request/SignInRequestModel';
import AuthenticationResponseModel from '../core/response/AuthenticationResponseModel';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase from './ServiceBase';
import type {ServiceOptions} from './ServiceBase';

export default class GateService extends ServiceBase {
	constructor(cancelTokenSource: CancelTokenSource, options?: ServiceOptions, setProgress?: SetProgressInfo) {
		super(cancelTokenSource, options, setProgress);
	}

	async authenticate(body: SignInRequestModel): Promise<AuthenticationResponseModel> {
		const response = await this.client.post('/api/gate/authenticate', body);
		return response.data;
	}

	async clearSession(): Promise<AuthenticationResponseModel> {
		const response = await this.client.post('/api/gate/exit');
		return response.data;
	}

	async getUserPassport(): Promise<AuthenticationResponseModel> {
		const response = await this.client.get('/api/gate/passport');
		return response.data;
	}
}
