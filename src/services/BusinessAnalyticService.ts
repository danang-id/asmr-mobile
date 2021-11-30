import {CancelTokenSource} from 'axios';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import BusinessAnalyticsResponseModel from 'asmr/core/response/BusinessAnalyticsResponseModel';
import ServiceBase, {ServiceOptions} from 'asmr/services/ServiceBase';

class BusinessAnalyticService extends ServiceBase {
	private servicePath = '/api/BusinessAnalytic/';

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		super(cancelTokenSource, setProgress, options);
		super.tag = BusinessAnalyticService.name;
	}

	public async getMine(): Promise<BusinessAnalyticsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}

	public async getByBeanId(beanId: string): Promise<BusinessAnalyticsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get(this.servicePath + 'bean/' + beanId);
			return this.processData(response);
		} finally {
			this.finalize();
		}
	}
}

export default BusinessAnalyticService;
