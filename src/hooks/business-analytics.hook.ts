import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import useLogger from 'asmr/hooks/logger.hook';
import useServices from 'asmr/hooks/service.hook';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';

interface BusinessAnalyticHooks {
	analytics?: StructuredBusinessAnalytics;
	isAnalyticsValidating: boolean;
	getAnalyticsByBeanId(beanId: string): Promise<StructuredBusinessAnalytics | undefined>;
	revalidate(): Promise<void>;
}

const BUSINESS_ANALYTICS_HOOK_TAG = 'BusinessAnalyticHooks';
function useBusinessAnalytics(): BusinessAnalyticHooks {
	const logger = useLogger(BUSINESS_ANALYTICS_HOOK_TAG);
	const {
		handleError,
		handleErrors,
		businessAnalytic: businessAnalyticService,
	} = useServices(BUSINESS_ANALYTICS_HOOK_TAG);

	async function getAnalyticsByBeanId(beanId: string): Promise<StructuredBusinessAnalytics | undefined> {
		try {
			const result = await businessAnalyticService.getByBeanId(beanId);
			if (result.isSuccess && result.data) {
				return result.data;
			}

			if (result.errors) {
				handleErrors(result.errors, logger);
			}
		} catch (error) {
			handleError(error as Error, logger);
		}
	}

	async function revalidate() {
		// Nothing
	}

	return {
		analytics: createStructuredBusinessAnalytics([]),
		isAnalyticsValidating: false,
		getAnalyticsByBeanId,
		revalidate,
	};
}

export default useBusinessAnalytics;
