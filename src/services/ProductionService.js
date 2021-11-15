import StartProductionRequestModel from '../core/request/StartProductionRequestModel';
import FinalizeProductionRequestModel from '../core/request/FinalizeProductionRequestModel';
import ProductionResponseModel from '../core/response/ProductionResponseModel';
import ProductionsResponseModel from '../core/response/ProductionsResponseModel';
import ServiceBase from './ServiceBase';

export default class ProductionService extends ServiceBase {
	#servicePath = '/api/production/';

	async getAll(showMine: boolean = true): Promise<ProductionsResponseModel> {
		try {
			const response = await this.client.get(this.#servicePath, {
				params: {showMine},
			});
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async getById(id: string): Promise<ProductionResponseModel> {
		try {
			const response = await this.client.get(this.#servicePath + id);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async start(body: StartProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			const response = await this.client.post(this.#servicePath + 'start', body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async finalize(id: string, body: FinalizeProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			const response = await this.client.post(this.#servicePath + 'finalize/' + id, body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async cancel(id: string): Promise<ProductionResponseModel> {
		try {
			const response = await this.client.delete(this.#servicePath + 'cancel/' + id);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
