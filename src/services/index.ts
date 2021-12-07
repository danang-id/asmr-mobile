import axios from 'axios';
import {Alert} from 'react-native';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import ErrorInformation from 'asmr/core/common/ErrorInformation';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import {ILogger} from 'asmr/libs/common/Logger';
import BeanService from 'asmr/services/BeanService';
import BusinessAnalyticService from 'asmr/services/BusinessAnalyticService';
import GateService from 'asmr/services/GateService';
import IncomingGreenBeanService from 'asmr/services/IncomingGreenBeanService';
import ProductionService from 'asmr/services/ProductionService';
import ReleaseService from 'asmr/services/ReleaseService';
import {ServiceParameters} from 'asmr/services/ServiceBase';

export type Services = {
	abort: (message?: string) => void;
	handleError: typeof handleError;
	handleErrors: typeof handleErrors;
	bean: BeanService;
	businessAnalytic: BusinessAnalyticService;
	gate: GateService;
	incomingGreenBean: IncomingGreenBeanService;
	production: ProductionService;
	release: ReleaseService;
};

export type ServiceErrorHandlerOptions = {
	intercept?: (error?: Error) => string;
	showAlert: boolean;
	showLog: boolean;
};

export type ServiceErrorsHandlerOptions = {
	intercept?: (errors?: ErrorInformation[]) => string | string[];
	showAlert: boolean;
	showLog: boolean;
};

declare function handleError(error?: Error, logger?: ILogger, options?: ServiceErrorHandlerOptions): void;
declare function handleError(
	operation: string,
	error?: Error,
	logger?: ILogger,
	options?: ServiceErrorHandlerOptions,
): void;

declare function handleErrors(
	errors?: ErrorInformation[],
	logger?: ILogger,
	options?: ServiceErrorsHandlerOptions,
): void;
declare function handleErrors(
	operation: string,
	errors?: ErrorInformation[],
	logger?: ILogger,
	options?: ServiceErrorsHandlerOptions,
): void;

function createServices(setProgress: SetProgressInfo, requesterTag: string): Services {
	const cancelTokenSource = axios.CancelToken.source();
	const parameters: ServiceParameters = {cancelTokenSource, setProgress, options: {requesterTag}};

	function abort(message?: string) {
		setProgress(false, 0);
		cancelTokenSource.cancel(message);
	}

	function handleError(error?: Error, logger?: ILogger, options?: ServiceErrorHandlerOptions): void;
	function handleError(
		operation: string,
		error?: Error,
		logger?: ILogger,
		options?: ServiceErrorHandlerOptions,
	): void;
	function handleError(
		errorOrOperation?: Error | string,
		loggerOrError?: ILogger | Error,
		optionsOrLogger?: ServiceErrorHandlerOptions | ILogger,
		options?: ServiceErrorHandlerOptions,
	) {
		const operationAsFirstArg = typeof errorOrOperation === 'string';
		const operation = operationAsFirstArg ? errorOrOperation : 'Operation';
		const error = operationAsFirstArg ? (loggerOrError as Error) : (errorOrOperation as Error);
		const logger = operationAsFirstArg ? (optionsOrLogger as ILogger) : (loggerOrError as ILogger);
		if (!options) {
			const defaultOptions: ServiceErrorHandlerOptions = {showAlert: true, showLog: false};
			options = operationAsFirstArg
				? defaultOptions
				: (optionsOrLogger as ServiceErrorHandlerOptions) ?? defaultOptions;
		}

		function show(message: string, options: ServiceErrorHandlerOptions) {
			if (logger && options.showLog) {
				logger.error(`${operation} Request Service Error:`, message);
			}

			if (options.showAlert) {
				Alert.alert(`${operation} Failed`, message);
			}
		}

		if (!error || !error.message) {
			return;
		}

		let errorMessage = error.message;

		if (options.intercept) {
			errorMessage = options.intercept(error);
		}

		show(errorMessage, options);
	}

	function handleErrors(errors?: ErrorInformation[], logger?: ILogger, options?: ServiceErrorsHandlerOptions): void;
	function handleErrors(
		operation: string,
		errors?: ErrorInformation[],
		logger?: ILogger,
		options?: ServiceErrorsHandlerOptions,
	): void;
	function handleErrors(
		errorOrOperation?: string | ErrorInformation[],
		loggerOrError?: ErrorInformation[] | ILogger,
		optionsOrLogger?: ILogger | ServiceErrorsHandlerOptions,
		options?: ServiceErrorsHandlerOptions,
	) {
		const operationAsFirstArg = typeof errorOrOperation === 'string';
		const operation = operationAsFirstArg ? errorOrOperation : 'Operation';
		const errors = operationAsFirstArg
			? (loggerOrError as ErrorInformation[])
			: (errorOrOperation as ErrorInformation[]);
		const logger = operationAsFirstArg ? (optionsOrLogger as ILogger) : (loggerOrError as ILogger);
		if (!options) {
			const defaultOptions: ServiceErrorsHandlerOptions = {showAlert: true, showLog: false};
			options = operationAsFirstArg
				? defaultOptions
				: (optionsOrLogger as ServiceErrorsHandlerOptions) ?? defaultOptions;
		}

		if (!errors || !Array.isArray(errors)) {
			return;
		}

		if (errors.findIndex(error => error.code === ErrorCode.NotAuthenticated) !== -1) {
			// This conditional is used on the Web to redirect to sign-in page, but irrelevant in mobile application.
			// However, this condition may actually useful in the future, so it will be keep here.
		}

		if (logger && options.showLog) {
			for (const error of errors.reverse()) {
				logger.error(`${operation} Request Failed:`, error.reason);
			}
		}

		if (options.showAlert) {
			const firstError = errors[0];
			Alert.alert(`${operation} Failed`, firstError.reason);
		}
	}

	return {
		abort,
		handleError,
		handleErrors,
		bean: new BeanService(parameters),
		businessAnalytic: new BusinessAnalyticService(parameters),
		gate: new GateService(parameters),
		incomingGreenBean: new IncomingGreenBeanService(parameters),
		production: new ProductionService(parameters),
		release: new ReleaseService(parameters),
	};
}

export default createServices;
