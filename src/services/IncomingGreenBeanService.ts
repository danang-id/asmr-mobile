import CreateIncomingGreenBeanRequestModel from 'asmr/core/request/CreateIncomingGreenBeanRequestModel';
import BeanResponseModel from 'asmr/core/response/BeanResponseModel';
import IncomingGreenBeansResponseModel from 'asmr/core/response/IncomingGreenBeansResponseModel';
import ServiceBase, {ServiceParameters} from 'asmr/services/ServiceBase';

class IncomingGreenBeanService extends ServiceBase {
	private servicePath = '/api/incominggreenbean/';

	constructor(parameters: ServiceParameters) {
		super(parameters);
		super.tag = IncomingGreenBeanService.name;
	}

	public async getAll(showMine = true): Promise<IncomingGreenBeansResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath, {
				params: {showMine},
			});
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}

	public async create(id: string, body: CreateIncomingGreenBeanRequestModel): Promise<BeanResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + id, body);
			return this.extract(response);
		} finally {
			this.finalize();
		}
	}
}

export default IncomingGreenBeanService;
