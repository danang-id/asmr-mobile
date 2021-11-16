import {CancelTokenSource} from 'axios';
import CreateIncomingGreenBeanRequestModel from '../core/request/CreateIncomingGreenBeanRequestModel';
import BeanResponseModel from '../core/response/BeanResponseModel';
import IncomingGreenBeansResponseModel from '../core/response/IncomingGreenBeansResponseModel';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class IncomingGreenBeanService extends ServiceBase {
	#servicePath = '/api/incominggreenbean/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = IncomingGreenBeanService.name;
	}

	async getAll(showMine: boolean = true): Promise<IncomingGreenBeansResponseModel> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath, {
				params: {showMine},
			});
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async create(id: string, body: CreateIncomingGreenBeanRequestModel): Promise<BeanResponseModel> {
		try {
			this._start();
			const response = await this.client.post(this.#servicePath + id, body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
