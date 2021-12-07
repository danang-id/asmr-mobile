import BeanResponseModel from 'asmr/core/response/BeanResponseModel';
import BeansResponseModel from 'asmr/core/response/BeansResponseModel';
import ServiceBase, {ServiceParameters} from 'asmr/services/ServiceBase';

class BeanService extends ServiceBase {
	private servicePath = '/api/bean/';

	constructor(parameters: ServiceParameters) {
		super(parameters);
		super.tag = BeanService.name;
	}

	public async getAll(): Promise<BeansResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath);
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}

	public async getById(id: string): Promise<BeanResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + id);
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}
}

export default BeanService;
