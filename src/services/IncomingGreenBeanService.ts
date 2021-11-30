import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import CreateIncomingGreenBeanRequestModel from 'asmr/core/request/CreateIncomingGreenBeanRequestModel';
import BeanResponseModel from 'asmr/core/response/BeanResponseModel';
import IncomingGreenBeansResponseModel from 'asmr/core/response/IncomingGreenBeansResponseModel';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class IncomingGreenBeanService extends ServiceBase {
	private servicePath = '/api/IncomingGreenBean/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = IncomingGreenBeanService.name;
	}

	public async getAll(showMine = true): Promise<IncomingGreenBeansResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath, {
				params: {showMine},
			});
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async create(id: string, body: CreateIncomingGreenBeanRequestModel): Promise<BeanResponseModel> {
		try {
			this.prepare();
			const response = await this.client.post(this.servicePath + id, body);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default IncomingGreenBeanService;
