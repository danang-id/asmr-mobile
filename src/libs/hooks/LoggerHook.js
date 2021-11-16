import type {ILogger} from '../common/Logger';
import {Logger, NoLogger} from '../common/Logger';

function useLogger(nameOrFunction: Function | string): ILogger {
	const tag = typeof nameOrFunction === 'string' ? nameOrFunction : nameOrFunction.name;
	const logger = process.env.NODE_ENV === 'production' ? NoLogger : Logger;

	return {
		error(...args) {
			logger.error(tag, ...args);
		},
		info(...args) {
			logger.info(tag, ...args);
		},
		warn(...args) {
			logger.info(tag, ...args);
		},
	};
}

export default useLogger;
