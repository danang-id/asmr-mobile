import {useEffect} from 'react';

export function useInitAsync(initHandler: () => Promise<void>) {
	useEffect(() => {
		initHandler().catch();
	}, []);
}

export function useInit(initHandler: (() => void) | (() => () => void)) {
	useEffect(() => {
		const clearSubscription = initHandler();
		if (typeof clearSubscription === 'function') {
			return clearSubscription();
		}
	}, []);
}

export default useInitAsync;
