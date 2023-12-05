/** A method for writing data to a logging channel. */
export interface LoggingMethod {
	/**
	 * @param tag {@link Log.tag}
	 * @param data The first part of the data being written to the channel.
	 * @param rest The rest of the data being written to the channel.
	 */
	(tag: string, data: unknown, ...rest: unknown[]): void;
}

/** Provides methods for writing to various logging channels. */
export interface LoggingProvider {
	/** Write data to the error channel. */
	error: LoggingMethod;
	/** Write data to the information channel. */
	info: LoggingMethod;
	/** Write data to the warning channel. */
	warn: LoggingMethod;
}
