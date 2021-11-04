import {useContext} from 'react';
import AuthenticationContext from '../context/AuthenticationContext';

function useAuthentication() {
	return useContext(AuthenticationContext);
}

export default useAuthentication;
