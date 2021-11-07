import {Alert} from 'react-native';
import axios from 'axios';
import ErrorInformation from '../core/common/ErrorInformation';
import ErrorCode from '../core/enums/ErrorCode';
import type {ILogger} from '../libs/common/Logger';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import GateService from './GateService';

export type Services = {
	abort: () => void,
	handleError: (error?: Error, logger?: ILogger) => void,
	handleErrors: (errors?: ErrorInformation[], logger?: ILogger) => void,
	gate: GateService,
};

export type ServiceErrorHandlerOptions = {
	intercept: (error?: Error) => string,
	showAlert: boolean,
	showLog: boolean,
};

export type ServiceErrorsHandlerOptions = {
	intercept: (errors?: ErrorInformation[]) => string | string[],
	showAlert: boolean,
	showLog: boolean,
};

function createServices(setProgress?: SetProgressInfo): Services {
	const cancelTokenSource = axios.CancelToken.source();

	function abort(message?: string) {
		if (setProgress) {
			setProgress(false, 0);
		}
		cancelTokenSource.cancel(message);
	}

	function handleError(
		error?: Error,
		logger?: ILogger,
		options: ServiceErrorHandlerOptions = {showAlert: true, showLog: true},
	) {
		function show(message: string) {
			if (logger && options.showLog) {
				logger.error('Caught error, message:', message);
			}

			if (options.showAlert) {
				Alert.alert('An Error Occurred', message);
			}
		}

		if (!error || !error.message) {
			return;
		}

		let errorMessage = error.message;

		if (options.intercept) {
			errorMessage = options.intercept(error);
		}

		if (error.message === 'Failed to fetch') {
			errorMessage = 'We are unable to communicate with our back at the moment. Please try again later.';
		}

		show(errorMessage);
	}

	function handleErrors(
		errors?: ErrorInformation[],
		logger?: ILogger,
		options: ServiceErrorsHandlerOptions = {showAlert: true, showLog: false},
	) {
		if (!errors || !Array.isArray(errors)) {
			return;
		}

		if (errors.findIndex(error => error.code === ErrorCode.NotAuthenticated) !== -1) {
			// TODO: Go To Sign In Page
		}

		if (logger && options.showLog) {
			for (const error of errors.reverse()) {
				logger.error('Request returns error, reason:', error.reason);
			}
		}

		if (options.showAlert) {
			const firstError = errors[0];
			Alert.alert('Error Occurred', firstError.reason);
		}
	}

	return {
		abort,
		handleError,
		handleErrors,
		gate: new GateService(cancelTokenSource, undefined, setProgress),
	};
}

export default createServices;
