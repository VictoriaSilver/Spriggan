import { Log } from "./log";
import type { LoggingMethod, LoggingProvider } from "./loggingProvider";

type ProviderCall = {
	[key in keyof LoggingProvider]: Parameters<
		LoggingProvider[key]
	> extends Parameters<LoggingMethod>
		? key
		: never;
}[keyof LoggingProvider];

type LogDebugCall = {
	[key in ProviderCall]: Log[`debug${Capitalize<key>}`] extends never
		? never
		: `debug${Capitalize<key>}`;
}[ProviderCall];

describe("Log", () => {
	let isDebug: boolean;
	let name: string;
	let provider: LoggingProvider;
	let log: Log;

	beforeEach(() => {
		isDebug = true;
		name = Math.random().toString();
		provider = {
			error: vi.fn(),
			info: vi.fn(),
			warn: vi.fn()
		};

		log = new Log(name, provider);
		log.isDebug = vi.fn(() => isDebug);
	});

	it.each<[key: ProviderCall, message: unknown, rest: unknown]>([
		["error", Math.random(), Math.random()],
		["info", Math.random(), Math.random()],
		["warn", Math.random(), Math.random()]
	])("should call %s", (key, message, rest) => {
		log[key](message, rest);

		expect(provider[key]).toBeCalledWith(log.tag, message, rest);
	});

	it.each<
		[
			key: LogDebugCall,
			providerKey: ProviderCall,
			message: unknown,
			rest: unknown
		]
	>([
		["debugError", "error", Math.random(), Math.random()],
		["debugInfo", "info", Math.random(), Math.random()],
		["debugWarn", "warn", Math.random(), Math.random()]
	])("should call %s in debug mode", (key, providerKey, message, rest) => {
		log[key](message, rest);

		expect(log.isDebug).toHaveBeenCalledOnce();
		expect(provider[providerKey]).toBeCalledWith(log.tag, message, rest);

		isDebug = false;
		log[key](message, rest);
		expect(log.isDebug).toHaveBeenCalledTimes(2);
		// Should not be called again
		expect(provider[providerKey]).toHaveBeenCalledOnce();
	});

	it("should handle assertions", () => {
		const message = Math.random().toString();
		const data = {};

		// Should not call; condition is true
		log.assert(true, message, data);
		expect(provider.error).not.toHaveBeenCalled();

		// Should call; condition is false
		log.assert(false, message, data);
		expect(provider.error).toHaveBeenCalledWith(
			log.tag,
			Log.ASSERTION_FAILED,
			message,
			data
		);

		// Should call; condition is false, isDebug is true
		log.debugAssert(false, message, data);
		expect(provider.error).toHaveBeenNthCalledWith(
			2,
			log.tag,
			Log.ASSERTION_FAILED,
			message,
			data
		);

		// Should not call; isDebug is false
		isDebug = false;
		log.debugAssert(false, message, data);
		expect(provider.error).toHaveBeenCalledTimes(2);
	});
});
