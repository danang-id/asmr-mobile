import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import FinishProductionRequestModel from 'asmr/core/request/FinalizeProductionRequestModel';
import StartProductionRequestModel from 'asmr/core/request/StartProductionRequestModel';
import ProductionResponseModel from 'asmr/core/response/ProductionResponseModel';
import ProductionsResponseModel from 'asmr/core/response/ProductionsResponseModel';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class ProductionService extends ServiceBase {
	private servicePath = '/api/Production/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = ProductionService.name;
	}

	public async getAll(showMine = true, showCancelled = true): Promise<ProductionsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath, {
				params: {showMine, showCancelled},
			});
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async getById(id: string): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + id);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async start(body: StartProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'start', body);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async finish(id: string, body: FinishProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'finish/' + id, body);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async cancel(id: string, isBeanBurnt: boolean): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.delete(this.servicePath + 'cancel/' + id, {
				params: {isBeanBurnt},
			});
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default ProductionService;
