import Logger, {ILogger} from 'asmr/libs/common/Logger';

// eslint-disable-next-line @typescript-eslint/ban-types
function useLogger(tag: Function | string): ILogger {
	tag = typeof tag === 'string' ? tag : tag.name;

	return {
		error(...args) {
			Logger.error(tag as string, ...args);
		},
		info(...args) {
			Logger.info(tag as string, ...args);
		},
		warn(...args) {
			Logger.info(tag as string, ...args);
		},
	};
}

export default useLogger;
