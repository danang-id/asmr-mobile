import {useContext} from 'react';
import AuthenticationContext from 'asmr/context/AuthenticationContext';

function useAuthentication() {
	const context = useContext(AuthenticationContext);
	if (!context) {
		throw new Error('AuthenticationProvider has not been registered.');
	}

	return context;
}

export default useAuthentication;
