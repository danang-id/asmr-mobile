import {CancelTokenSource} from 'axios';
import SignInRequestModel from '../core/request/SignInRequestModel';
import AuthenticationResponseModel from '../core/response/AuthenticationResponseModel';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class GateService extends ServiceBase {
	#servicePath = '/api/gate/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = GateService.name;
	}

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
