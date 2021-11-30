import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import BeanResponseModel from 'asmr/core/response/BeanResponseModel';
import BeansResponseModel from 'asmr/core/response/BeansResponseModel';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class BeanService extends ServiceBase {
	private servicePath = '/api/Bean/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = BeanService.name;
	}

	public async getAll(): Promise<BeansResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async getById(id: string): Promise<BeanResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + id);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default BeanService;
