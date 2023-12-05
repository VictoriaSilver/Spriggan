import { Log } from "./log";
import type { LoggingMethod, LoggingProvider } from "./loggingProvider";

type ProviderCall = {
	[key in keyof LoggingProvider]: Parameters<
		LoggingProvider[key]
	> extends Parameters<LoggingMethod>
		? key
		: never;
}[keyof LoggingProvider];

describe("Log", () => {
	let name: string;
	let provider: LoggingProvider;
	let log: Log;

	beforeEach(() => {
		name = Math.random().toString();
		provider = {
			error: vi.fn(),
			info: vi.fn(),
			warn: vi.fn()
		};

		log = new Log(name, provider);
	});

	it.each<[key: ProviderCall, message: unknown, rest: unknown]>([
		["error", Math.random(), Math.random()],
		["info", Math.random(), Math.random()],
		["warn", Math.random(), Math.random()]
	])("should call %s", (key, message, rest) => {
		log[key](message, rest);

		expect(provider[key]).toBeCalledWith(log.tag, message, rest);
	});
});
