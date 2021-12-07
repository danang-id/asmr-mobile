// import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

export type RefreshHookResult = [boolean, (callback?: () => void) => void];
export type RefreshPromise = () => PromiseLike<void>;
function useRefresh(refreshValues: RefreshPromise[]): RefreshHookResult {
	// const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState<boolean>(false);

	async function refreshAsync(callback?: () => void, silently = false) {
		try {
			if (!silently) {
				setRefreshing(true);
			}
			await Promise.all(refreshValues.map(value => value()));
			if (typeof callback === 'function') {
				callback();
			}
		} finally {
			setRefreshing(false);
		}
	}

	function refresh(callback?: () => void, silently = false) {
		refreshAsync(callback, silently).catch();
	}

	// function onNavigationFocus() {
	// 	refresh(true);
	// }

	useEffect(() => {
		refresh(undefined, true);
		// navigation.addListener('focus', onNavigationFocus);
		// return () => {
		// 	navigation.removeListener('focus', onNavigationFocus);
		// };
	}, []);

	return [refreshing, refresh];
}

export default useRefresh;
