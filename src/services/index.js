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

function createServices(setProgress?: SetProgressInfo): Services {
	const cancelTokenSource = axios.CancelToken.source();

	function abort(message?: string) {
		if (setProgress) {
			setProgress(false, 0);
		}
		cancelTokenSource.cancel(message);
	}

	function handleError(error?: Error, logger?: ILogger) {
		if (error && error.message) {
			if (error.message === 'Failed to fetch') {
				error.message = 'We are unable to communicate with our back at the moment. Please try again later.';
			}
			if (logger) {
				logger.error('Caught error, message:', error.message);
			}
		}
	}

	function handleErrors(errors?: ErrorInformation[], logger?: ILogger) {
		function printError(message: string) {
			if (logger) {
				logger.error('Request returns error, reason:', message);
			}
		}

		if (errors && Array.isArray(errors)) {
			if (errors.findIndex(error => error.code === ErrorCode.NotAuthenticated) !== -1) {
				// TODO: Go To Sign In Page
			}
			for (const error of errors.reverse()) {
				switch (error.code) {
					case ErrorCode.InvalidAntiforgeryToken:
						printError('Your session has ended. Please refresh this page.');
						break;
					default:
						printError(error.reason);
				}
			}
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
