import type { LoggingProvider } from "./loggingProvider";

/** Writes messages to various text channels. */
export class Log {
	/** An identifying string which is prepended to each message. */
	tag: string;

	/**
	 * @param name The name of this log, used to generate {@link tag}.
	 * @param provider An object which provides the underlying logging methods.
	 */
	constructor(
		public readonly name: string,
		public readonly provider: LoggingProvider = console
	) {
		this.tag = `[${name}]`;
	}

	/** Whether the log is running in a debug environment. */
	isDebug(): boolean {
		return import.meta.env.DEV ?? false;
	}

	/**
	 * Write data to the error channel if running in a debug environment.
	 */
	debugError(data: unknown, ...rest: unknown[]): void {
		if (this.isDebug()) this.error(data, ...rest);
	}

	/**
	 * Write data to the information channel if running in a debug environment.
	 */
	debugInfo(data: unknown, ...rest: unknown[]): void {
		if (this.isDebug()) this.info(data, ...rest);
	}

	/**
	 * Write data to the warning channel if running in a debug environment.
	 */
	debugWarn(data: unknown, ...rest: unknown[]): void {
		if (this.isDebug()) this.warn(data, ...rest);
	}

	/** Write data to the error channel. */
	error(data: unknown, ...rest: unknown[]): void {
		this.provider.error(this.tag, data, ...rest);
	}

	/** Write data to the information channel. */
	info(data: unknown, ...rest: unknown[]): void {
		this.provider.info(this.tag, data, ...rest);
	}

	/** Write data to the warning channel. */
	warn(data: unknown, ...rest: unknown[]): void {
		this.provider.warn(this.tag, data, ...rest);
	}
}
