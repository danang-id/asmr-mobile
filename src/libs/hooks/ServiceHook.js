import {useEffect} from 'react';
import useProgress from './ProgressHook';
import type {Services} from '../../services';
import createServices from '../../services';
import type {ProgressContextInfo} from '../context/ProgressContextInfo';

function useServices(): Services {
	const progressContext: ProgressContextInfo = useProgress();
	const setProgress = progressContext[1];
	const services = createServices(setProgress);
	useEffect(() => {
		return () => services.abort();
	}, []);
	return services;
}

export default useServices;
