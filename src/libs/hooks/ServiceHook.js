/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import useProgress from './ProgressHook';
import type {Services} from '../../services';
import createServices from '../../services';

function useServices(): Services {
	// eslint-disable-next-line no-unused-vars
	const [_, setProgress] = useProgress();
	const services = createServices(setProgress);
	useEffect(() => {
		return () => services.abort();
	}, []);
	return services;
}

export default useServices;
