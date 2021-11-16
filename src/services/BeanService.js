import {CancelTokenSource} from 'axios';
import BeanResponseModel from '../core/response/BeanResponseModel';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class BeanService extends ServiceBase {
	#servicePath = '/api/bean/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = BeanService.name;
	}

	async getById(id: string): Promise<BeanResponseModel> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath + id);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
