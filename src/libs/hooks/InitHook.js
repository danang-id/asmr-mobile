import {useEffect} from 'react';

function useInit(initHandler: () => Promise<void>) {
	useEffect(() => {
		initHandler().catch();
	}, []);
}

export default useInit;
