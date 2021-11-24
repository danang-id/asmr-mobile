import {Platform} from 'react-native';
import {getDeviceName} from 'react-native-device-info';
import {FileLogger as FileLogging, LogLevel} from 'react-native-file-logger';

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

function formatConsole(deviceName: string, tag: string, ...args: string[]) {
	const now = new Date();
	const title = `\x1b[1m\x1b[32m[${deviceName ?? Platform.OS}] \x1b[36m${tag}\x1b[0m\n      `;
	const time = `\x1b[33m${now.toISOString()}\x1b[0m`;
	return `${title} ${time} ${args.join(' ')}`;
}

function formatFile(tag: string, ...args: string[]) {
	return `${tag}: ${args.join(' ')}`;
}

export const FileLogger: ILoggerWithTag = (function () {
	const logger: ILoggerWithTag = {
		error(tag, ...args) {
			FileLogging.write(LogLevel.Error, formatFile(tag, ...args));
		},
		info(tag, ...args) {
			FileLogging.write(LogLevel.Info, formatFile(tag, ...args));
		},
		warn(tag, ...args) {
			FileLogging.write(LogLevel.Warning, formatFile(tag, ...args));
		},
	};
	return logger;
})();

export const ConsoleLogger: ILoggerWithTag = (function () {
	let deviceName;
	getDeviceName().then(name => (deviceName = name));

	const logger: ILoggerWithTag = {
		error(tag, ...args) {
			FileLogging.write(LogLevel.Error, formatFile(tag, ...args));
			console.error(formatConsole(deviceName, tag, ...args));
		},
		info(tag, ...args) {
			FileLogging.write(LogLevel.Info, formatFile(tag, ...args));
			console.info(formatConsole(deviceName, tag, ...args));
		},
		warn(tag, ...args) {
			FileLogging.write(LogLevel.Warning, formatFile(tag, ...args));
			console.warn(formatConsole(deviceName, tag, ...args));
		},
	};
	return logger;
})();

export default process.env.NODE_ENV === 'production' ? FileLogger : ConsoleLogger;
