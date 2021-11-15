import CreateIncomingGreenBeanRequestModel from '../core/request/CreateIncomingGreenBeanRequestModel';
import BeanResponseModel from '../core/response/BeanResponseModel';
import IncomingGreenBeansResponseModel from '../core/response/IncomingGreenBeansResponseModel';
import ServiceBase from './ServiceBase';

export default class IncomingGreenBeanService extends ServiceBase {
	#servicePath = '/api/incominggreenbean/';

	async getAll(showMine: boolean = true): Promise<IncomingGreenBeansResponseModel> {
		try {
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
			const response = await this.client.post(this.#servicePath + id, body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
