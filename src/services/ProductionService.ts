import FinishProductionRequestModel from 'asmr/core/request/FinalizeProductionRequestModel';
import StartProductionRequestModel from 'asmr/core/request/StartProductionRequestModel';
import ProductionResponseModel from 'asmr/core/response/ProductionResponseModel';
import ProductionsResponseModel from 'asmr/core/response/ProductionsResponseModel';
import ServiceBase, {ServiceParameters} from 'asmr/services/ServiceBase';

class ProductionService extends ServiceBase {
	private servicePath = '/api/production/';

	constructor(parameters: ServiceParameters) {
		super(parameters);
		super.tag = ProductionService.name;
	}

	public async getAll(showMine = true, showCancelled = true): Promise<ProductionsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath, {
				params: {showMine, showCancelled},
			});
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}

	public async getById(id: string): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + id);
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}

	public async start(body: StartProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'start', body);
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}

	public async finish(id: string, body: FinishProductionRequestModel): Promise<ProductionResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + 'finish/' + id, body);
			return this.extract(response);
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
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}
}

export default ProductionService;
