import MagicString from "magic-string";
import { paths } from "../util/paths";
import {
	appendContentLoaderHeader,
	appendLoaderCode,
	cacheProjectData,
	createVirtualModule,
	generateVirtualModuleID,
	type KnownProjects,
	shouldInjectLoader,
	shouldResolveID,
	shouldRespondWithVirtualModule
} from "./contentLoaderPlugin";
import { ContentLoaderMissingDataError } from "./errors";

const goodDataRoot = paths.fromPackages("@spriggan/data/src");
const goodDataEntry = paths.fromPackages(`${goodDataRoot}/index.ts`);
const badDataEntry = paths.fromPackages("@spriggan/core/src/index.ts");
const goodVirtualModule = generateVirtualModuleID("good");
const badVirtualModule = `_${Math.random()}`;

describe("contentLoaderPlugin", () => {
	it("should identify when to resolve an ID", () => {
		expect(shouldResolveID(goodVirtualModule, goodDataEntry)).toEqual(true);
		expect(shouldResolveID(goodVirtualModule, badDataEntry)).toEqual(false);
		expect(shouldResolveID(badVirtualModule, goodDataEntry)).toEqual(false);
		expect(shouldResolveID(badVirtualModule, badDataEntry)).toEqual(false);
	});

	it("should identify when to inject the loader", () => {
		expect(shouldInjectLoader(goodDataEntry)).toEqual(true);
		expect(shouldInjectLoader(badDataEntry)).toEqual(false);
	});

	it("should identify when to respond with a virtual module", () => {
		expect(shouldRespondWithVirtualModule(goodVirtualModule)).toEqual(true);
		expect(shouldRespondWithVirtualModule(badVirtualModule)).toEqual(false);
	});

	it("should initialize project data", () => {
		const projectName = "@spriggan/data";
		const knownProjects: KnownProjects = {};

		const virtualModuleID = cacheProjectData(goodDataEntry, knownProjects);

		const data = knownProjects[virtualModuleID];
		expect(data).toMatchObject({
			entryDirectory: paths.fromPackages(`${projectName}/src`),
			entryFileName: "index",
			entryFileExtension: ".ts",
			projectRoot: paths.fromPackages(projectName),
			projectName
		});
	});

	it("should inject the virtual module import", () => {
		const magicString = appendLoaderCode("", goodDataEntry, goodVirtualModule);
		expect(magicString.toString().trim()).toEqual(
			`;\nimport "${goodVirtualModule}";`
		);
	});

	it("should throw an error when a project is missing data", async () => {
		await expect(async () => {
			await createVirtualModule("", {});
		}).rejects.toThrowError(ContentLoaderMissingDataError);
	});

	it("should generate content imports", async () => {
		const knownProjects: KnownProjects = {};
		const virtualModuleID = cacheProjectData(goodDataEntry, knownProjects);
		const rootFile = "rootFile";
		const nestedFile = "nested/file";
		const expected = new MagicString("");

		const fileGetter = async (): Promise<string[]> => [
			`${rootFile}.ts`,
			`${nestedFile}.ts`
		];

		const virtualModule = await createVirtualModule(
			virtualModuleID,
			knownProjects,
			fileGetter
		);
		appendContentLoaderHeader(expected);

		expected.append(`import * as _0 from "${goodDataRoot}/${rootFile}";\n`);
		expected.append(`modules["${rootFile}"] = _0;\n`);

		expected.append(`import * as _1 from "${goodDataRoot}/${nestedFile}";\n`);
		expected.append(`modules["${nestedFile}"] = _1;\n`);

		expected.append("content.loadModules(modules);");

		expect(virtualModule).toEqual(expected.toString());
	});
});
