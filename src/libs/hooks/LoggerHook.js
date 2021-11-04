import type {ILogger} from '../common/Logger';
import Logger, {NoLogger} from '../common/Logger';

function useLogger(nameOrFunction: Function | string): ILogger {
	if (process.env.NODE_ENV === 'production') {
		return new NoLogger();
	}

	return new Logger(typeof nameOrFunction === 'string' ? nameOrFunction : nameOrFunction.name);
}

export default useLogger;
