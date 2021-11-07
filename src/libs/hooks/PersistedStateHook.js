import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogger from './LoggerHook';
import useInit from './InitHook';

function usePersistedState<T>(name: string, initialValue?: T): [T | undefined, (value?: T) => void] {
	useInit(onInit);
	const persistenceKey = 'ASMR_PERSISTENCE_' + name;
	const logger = useLogger(usePersistedState);
	const [state, setLocalState] = useState();

	async function onInit() {
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
		setPersistedState(value).then().catch(logger.error);
	}

	return [state, setState];
}

export default usePersistedState;
