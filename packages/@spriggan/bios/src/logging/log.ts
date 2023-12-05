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
