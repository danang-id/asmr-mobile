import type {ILogger} from '../common/Logger';
import Logger from '../common/Logger';

function useLogger(nameOrFunction: Function | string): ILogger {
	const tag = typeof nameOrFunction === 'string' ? nameOrFunction : nameOrFunction.name;

	return {
		error(...args) {
			Logger.error(tag, ...args);
		},
		info(...args) {
			Logger.info(tag, ...args);
		},
		warn(...args) {
			Logger.info(tag, ...args);
		},
	};
}

export default useLogger;
