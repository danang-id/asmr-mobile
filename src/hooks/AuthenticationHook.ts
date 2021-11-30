import {useContext} from 'react';
import AuthenticationContext from 'asmr/context/AuthenticationContext';
import {useInitAsync} from 'asmr/hooks/InitHook';

function useAuthentication() {
	useInitAsync(onInitAsync);
	const context = useContext(AuthenticationContext);

	function onInitAsync(): Promise<void> {
		return context.refresh();
	}

	return context;
}

export default useAuthentication;
