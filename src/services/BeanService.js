import BeanResponseModel from '../core/response/BeanResponseModel';
import ServiceBase from './ServiceBase';

export default class BeanService extends ServiceBase {
	#servicePath = '/api/bean/';

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
