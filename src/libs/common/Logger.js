import {getDeviceName} from 'react-native-device-info';
import {Platform} from 'react-native';

type WriterFunction = (...args: any[]) => void;
export interface ILogger {
	error(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
}
export interface ILoggerWithTag {
	error(tag: string, ...args: any[]): void;
	info(tag: string, ...args: any[]): void;
	warn(tag: string, ...args: any[]): void;
}

export const Logger: ILoggerWithTag = (function () {
	let deviceName;
	getDeviceName().then(name => (deviceName = name));

	function write(writer: WriterFunction, tag: string, ...args: string[]) {
		const now = new Date();
		const title = `\x1b[1m\x1b[32m[${deviceName ?? Platform.OS}] \x1b[36m${tag}\x1b[0m\n      `;
		const time = `\x1b[33m${now.toISOString()}\x1b[0m`;
		writer(title, time, ...args);
	}

	const logger: ILoggerWithTag = {
		error(tag, ...args) {
			write(console.error, tag, ...args);
		},
		info(tag, ...args) {
			write(console.info, tag, ...args);
		},
		warn(tag, ...args) {
			write(console.warn, tag, ...args);
		},
	};
	return logger;
})();

export const NoLogger: ILoggerWithTag = (function () {
	return {
		error(tag, ...args) {},
		info(tag, ...args) {},
		warn(tag, ...args) {},
	};
})();

export default Logger;
