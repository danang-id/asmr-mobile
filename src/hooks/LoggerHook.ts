import {FC} from 'react';
import Logger, {ILogger} from 'asmr/libs/common/Logger';

function useLogger(nameOrFunction: FC | string): ILogger {
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
