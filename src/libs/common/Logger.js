import {getDeviceName} from 'react-native-device-info';

type WriterFunction = (...args: any[]) => void;

export interface ILogger {
	error(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
}

class Logger implements ILogger {
	deviceName: string;
	name: string;

	constructor(name: string) {
		this.deviceName = 'Unknown';
		this.name = name;
		getDeviceName().then(deviceName => (this.deviceName = deviceName));
	}

	write(write: WriterFunction, ...args: string[]) {
		const now = new Date();
		const title = `\x1b[1m\x1b[32m[${this.deviceName}] \x1b[36m${this.name}\x1b[0m\n      `;
		const time = `\x1b[33m${now.toISOString()}\x1b[0m`;
		write(title, time, ...args);
	}

	error(...args: any[]) {
		this.write(console.error.bind(this), ...args);
	}

	info(...args: any[]) {
		this.write(console.info.bind(this), ...args);
	}

	warn(...args: any[]) {
		this.write(console.warn.bind(this), ...args);
	}
}

export class NoLogger implements ILogger {
	error() {}
	info() {}
	warn() {}
}

export default Logger;
