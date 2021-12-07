import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useRef} from 'react';

function useRefreshOnFocus<T = never>(fetcher: () => Promise<T>) {
	const enabledRef = useRef(false);

	useFocusEffect(
		useCallback(() => {
			if (enabledRef.current) {
				fetcher().catch();
			} else {
				enabledRef.current = true;
			}
		}, [fetcher]),
	);
}

export default useRefreshOnFocus;
