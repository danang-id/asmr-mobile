import {useEffect} from 'react';
import useProgress from 'asmr/hooks/ProgressHook';
import createServices from 'asmr/services';

function useServices() {
	const {setProgress} = useProgress();
	const services = createServices(setProgress);
	useEffect(() => {
		return () => services.abort();
	}, []);
	return services;
}

export default useServices;
