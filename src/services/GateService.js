import SignInRequestModel from '../core/request/SignInRequestModel';
import AuthenticationResponseModel from '../core/response/AuthenticationResponseModel';
import ServiceBase from './ServiceBase';

export default class GateService extends ServiceBase {
	async authenticate(body: SignInRequestModel): Promise<AuthenticationResponseModel> {
		try {
			const response = await this.client.post('/api/gate/authenticate', body);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	async clearSession(): Promise<AuthenticationResponseModel> {
		try {
			const response = await this.client.post('/api/gate/exit');
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	async getUserPassport(): Promise<AuthenticationResponseModel> {
		try {
			const response = await this.client.get('/api/gate/passport');
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}
