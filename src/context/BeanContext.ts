import {createContext} from 'react';
import Bean from 'asmr/core/entities/Bean';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import {createStructuredBusinessAnalytics} from 'asmr/libs/common/BusinessAnalytics.helper';

export interface BeanContextInfo {
	beans: Bean[];
	isLoading: boolean;
	getBeanById(beanId: string, queryFromServer?: boolean): Promise<Bean | undefined>;
	getBusinessAnalyticsByBeanId(beanId: string): Promise<StructuredBusinessAnalytics>;
	refresh(): Promise<void>;
}

const BeanContext = createContext<BeanContextInfo>({
	beans: [],
	isLoading: false,
	getBeanById() {
		return Promise.resolve(undefined);
	},
	getBusinessAnalyticsByBeanId() {
		return Promise.resolve(createStructuredBusinessAnalytics([]));
	},
	refresh() {
		return Promise.resolve();
	},
});

export default BeanContext;
