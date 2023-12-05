import { ContentDefinition } from "./contentDefinition";
import { ContentRegistry } from "./contentRegistry";
import { CONTENT_IDENTITY } from "./contentSymbols";
import { ContentDuplicateIdentityError } from "./errors";

describe("ContentRegistry", () => {
	let registry: ContentRegistry;
	let goodID: string;
	let goodNestedID: string;

	class GoodDefinition extends ContentDefinition {}

	class GoodNestedDefinition extends ContentDefinition {}

	class BadDefinition {}

	beforeEach(() => {
		registry = new ContentRegistry();
		goodID = Math.random().toString();
		goodNestedID = (1 + Math.random()).toString();
	});

	it("should detect content definitions", () => {
		const tests: [input: unknown, expected: boolean][] = [
			[GoodDefinition, true],
			[GoodNestedDefinition, true],
			[BadDefinition, false],
			[null, false],
			[undefined, false],
			[true, false],
			[Math.random(), false],
			["string", false]
		];

		for (const [input, expected] of tests)
			expect(registry.isContentDefinition(input)).toEqual(expected);
	});

	it("should identify content definitions", () => {
		const goodInstance = new GoodDefinition();
		const goodNestedInstance = new GoodNestedDefinition();
		const badInstance = new BadDefinition();

		GoodDefinition[CONTENT_IDENTITY] = goodID;
		GoodNestedDefinition[CONTENT_IDENTITY] = goodNestedID;

		const tests: [
			input: ContentDefinition | typeof ContentDefinition,
			expected: string | null
		][] = [
			[GoodDefinition, goodID],
			[goodInstance, goodID],
			[GoodNestedDefinition, goodNestedID],
			[goodNestedInstance, goodNestedID],
			[BadDefinition, null],
			[badInstance, null]
		];

		for (const [input, expected] of tests)
			expect(registry.identify(input)).toEqual(expected);
	});

	it("should register and resolve content", () => {
		expect(() => registry.add(goodID, GoodDefinition)).not.toThrowError();
		expect(GoodDefinition[CONTENT_IDENTITY]).toEqual(goodID);
		expect(registry.resolve(goodID)).toEqual(GoodDefinition);
		expect(registry.resolve(Math.random().toString())).toEqual(null);
	});

	it("should throw an error when reusing an ID", () => {
		registry.add(goodID, GoodDefinition);
		expect(() => registry.add(goodID, GoodNestedDefinition)).toThrowError(
			ContentDuplicateIdentityError
		);
	});

	it("should generate well-formed IDs", () => {
		const nestedPath = Math.random.toString();
		const file = `${Math.random()}.ts`;
		const key = `_${Math.random()}`;

		expect(registry.generateID(`${nestedPath}/${file}`, key)).toEqual(
			`${nestedPath}:${key}`
		);

		expect(registry.generateID(file, key)).toEqual(key);
	});

	it("should load modules", () => {
		const module1Path = `${Math.random()}.ts`;
		const module2Path = `${Math.random()}/${Math.random()}.ts`;
		const module1Key = `_${Math.random()}`;
		const module2Key = `_${Math.random()}`;
		const module1Export = class extends ContentDefinition {};
		const module2Export = class extends ContentDefinition {};
		const module1ExpectedID = registry.generateID(module1Path, module1Key);
		const module2ExpectedID = registry.generateID(module2Path, module2Key);

		vi.spyOn(registry, "add");

		registry.loadModules({
			[module1Path]: {
				[module1Key]: module1Export
			},
			[module2Path]: {
				[module2Key]: module2Export
			}
		});

		expect(registry.add).nthCalledWith(1, module1ExpectedID, module1Export);
		expect(registry.add).nthCalledWith(2, module2ExpectedID, module2Export);
		expect(registry.resolve(module1ExpectedID)).toEqual(module1Export);
		expect(registry.resolve(module2ExpectedID)).toEqual(module2Export);
	});
});
