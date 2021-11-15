import SignInRequestModel from '../core/request/SignInRequestModel';
import AuthenticationResponseModel from '../core/response/AuthenticationResponseModel';
import ServiceBase from './ServiceBase';

export default class GateService extends ServiceBase {
	#servicePath = '/api/gate/';

	async authenticate(body: SignInRequestModel): Promise<AuthenticationResponseModel> {
		try {
			this._start();
			const response = await this.client.post(this.#servicePath + 'authenticate', body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async clearSession(): Promise<AuthenticationResponseModel> {
		try {
			this._start();
			const response = await this.client.post(this.#servicePath + 'exit');
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async getUserPassport(): Promise<AuthenticationResponseModel> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath + 'passport');
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
