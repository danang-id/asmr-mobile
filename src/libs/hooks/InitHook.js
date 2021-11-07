import {useEffect} from 'react';

function useInit(initHandler: () => Promise<void>) {
	useEffect(() => {
		initHandler().then().catch();
	}, []);
}

export default useInit;
