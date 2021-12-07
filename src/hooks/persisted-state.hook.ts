import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import useLogger from 'asmr/hooks/logger.hook';

export type PersistedStateResult<T> = [T | undefined, (value?: T) => void];

function usePersistedState<T>(name: string, initialValue?: T): PersistedStateResult<T> {
	const persistenceKey = 'ASMR_PERSISTENCE_' + name;
	const logger = useLogger('PersistedState');
	const [state, setLocalState] = useState<T>();

	async function onInitAsync(): Promise<void> {
		const persistedStateString = await AsyncStorage.getItem(persistenceKey);
		if (typeof persistedStateString !== 'undefined' && persistedStateString !== null) {
			setLocalState(JSON.parse(persistedStateString));
		} else if (typeof initialValue !== 'undefined' && initialValue !== null) {
			await setPersistedState(initialValue);
		}
	}

	async function setPersistedState(value?: T) {
		if (typeof value !== 'undefined' && value !== null) {
			await AsyncStorage.setItem(persistenceKey, JSON.stringify(value));
			setLocalState(value);
		} else {
			await AsyncStorage.removeItem(persistenceKey);
			setLocalState(undefined);
		}
	}

	function setState(value?: T) {
		setPersistedState(value).catch(logger.error);
	}

	useEffect(() => {
		onInitAsync().catch();
	}, []);

	return [state, setState];
}

export default usePersistedState;
