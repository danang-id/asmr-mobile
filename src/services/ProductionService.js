import {CancelTokenSource} from 'axios';
import StartProductionRequestModel from '../core/request/StartProductionRequestModel';
import FinishProductionRequestModel from '../core/request/FinalizeProductionRequestModel';
import ProductionResponseModel from '../core/response/ProductionResponseModel';
import ProductionsResponseModel from '../core/response/ProductionsResponseModel';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import ServiceBase, {ServiceOptions} from './ServiceBase';

export default class ProductionService extends ServiceBase {
	#servicePath = '/api/production/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = ProductionService.name;
	}

	async getAll(showMine: boolean = true, showCancelled: boolean = true): Promise<ProductionsResponseModel> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath, {
				params: {showMine, showCancelled},
			});
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async getById(id: string): Promise<ProductionResponseModel> {
		try {
			this._start();
			const response = await this.client.get(this.#servicePath + id);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async start(body: StartProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this._start();
			const response = await this.client.post(this.#servicePath + 'start', body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async finish(id: string, body: FinishProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this._start();
			const response = await this.client.post(this.#servicePath + 'finish/' + id, body);
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}

	async cancel(id: string, isBeanBurnt: boolean): Promise<ProductionResponseModel> {
		try {
			this._start();
			const response = await this.client.delete(this.#servicePath + 'cancel/' + id, {
				params: {isBeanBurnt},
			});
			return this._processData(response);
		} finally {
			this._finalize();
		}
	}
}
