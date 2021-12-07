import {AxiosResponse} from 'axios';
import BusinessAnalyticsResponseModel from 'asmr/core/response/BusinessAnalyticsResponseModel';
import StructuredBusinessAnalyticsResponseModel from 'asmr/core/response/StructuredBusinessAnalyticsResponseModel';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';
import ServiceBase, {ServiceParameters} from 'asmr/services/ServiceBase';

class BusinessAnalyticService extends ServiceBase {
	private servicePath = '/api/businessanalytic/';

	constructor(parameters: ServiceParameters) {
		super(parameters);
		super.tag = BusinessAnalyticService.name;
	}

	public async getMine(): Promise<StructuredBusinessAnalyticsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get<BusinessAnalyticsResponseModel>(this.servicePath);
			const {data, ...result} = this.extract(response);
			return {
				...result,
				data: createStructuredBusinessAnalytics(data ?? []),
			};
		} finally {
			this.finalize();
		}
	}

	public async getByBeanId(beanId: string): Promise<StructuredBusinessAnalyticsResponseModel> {
		try {
			this.prepare();
			const response = await this.client.get<BusinessAnalyticsResponseModel>(this.servicePath + 'bean/' + beanId);
			const {data, ...result} = this.extract(response);
			return {
				...result,
				data: createStructuredBusinessAnalytics(data ?? []),
			};
		} finally {
			this.finalize();
		}
	}
}

export default BusinessAnalyticService;
