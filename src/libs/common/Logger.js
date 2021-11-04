type WriterFunction = (...args: any[]) => void;

export interface ILogger {
	error(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
}

class Logger implements ILogger {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	write(write: WriterFunction, ...args: string[]) {
		write(`[${this.name}]`, ...args);
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
