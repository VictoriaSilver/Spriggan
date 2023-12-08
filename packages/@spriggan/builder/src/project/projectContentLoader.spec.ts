import MagicString from "magic-string";
import { INJECTED_PREFIX } from "../util/constants";
import { paths } from "../util/paths";
import { ProjectDataMissingError } from "./errors/projectDataMissingError";
import { ProjectContentLoader } from "./projectContentLoader";
import { ProjectData } from "./projectData";
import { defineProject } from "./projectDefiners";
import { ProjectManager } from "./projectManager";
import { ProjectType } from "./projectType";

const goodDataName = "@spriggan/data";
const goodDataRoot = paths.fromPackages(goodDataName);
const goodDataEntryDirectory = `${goodDataRoot}/src`;
const goodDataEntry = paths.fromPackages(`${goodDataEntryDirectory}/index.ts`);
const badDataEntry = paths.fromPackages("@spriggan/core/src/index.ts");
const goodVirtualModule = ProjectData.generateVirtualModuleID("good");
const badVirtualModule = `_${Math.random()}`;

describe("ProjectContentLoader", () => {
	let projectManager: ProjectManager;
	let contentLoader: ProjectContentLoader;

	const createFakeProject = (): ProjectData =>
		defineProject(projectManager, goodDataName, ProjectType.DATA);

	beforeEach(() => {
		projectManager = new ProjectManager();
		contentLoader = new ProjectContentLoader(projectManager);
	});

	it("should identify when to resolve an ID", () => {
		expect(
			contentLoader.shouldResolveID(goodVirtualModule, goodDataEntry)
		).toEqual(true);
		expect(
			contentLoader.shouldResolveID(goodVirtualModule, badDataEntry)
		).toEqual(false);
		expect(
			contentLoader.shouldResolveID(badVirtualModule, goodDataEntry)
		).toEqual(false);
		expect(
			contentLoader.shouldResolveID(badVirtualModule, badDataEntry)
		).toEqual(false);
	});

	it("should identify when to inject the loader", () => {
		expect(contentLoader.shouldInjectLoader(goodDataEntry)).toEqual(true);
		expect(contentLoader.shouldInjectLoader(badDataEntry)).toEqual(false);
	});

	it("should identify when to respond with a virtual module", () => {
		expect(
			contentLoader.shouldRespondWithVirtualModule(goodVirtualModule)
		).toEqual(true);
		expect(
			contentLoader.shouldRespondWithVirtualModule(badVirtualModule)
		).toEqual(false);
	});

	it("should inject the virtual module import", () => {
		const magicString = contentLoader.appendLoaderCode(
			"",
			goodDataEntry,
			goodVirtualModule
		);
		expect(magicString.toString().trim()).toEqual(
			`;\nimport "${goodVirtualModule}";`
		);
	});

	it("should throw an error when a project is missing data", async () => {
		await expect(async () => {
			await contentLoader.createVirtualModule(badVirtualModule);
		}).rejects.toThrowError(ProjectDataMissingError);

		await expect(async () => {
			await contentLoader.injectLoader(badVirtualModule);
		}).rejects.toThrowError(ProjectDataMissingError);
	});

	it("should generate content imports", async () => {
		const project = createFakeProject();

		const rootFile = "rootFile";
		const nestedFile = "nested/file";
		const expected = new MagicString("");
		const fileGetter = async (): Promise<string[]> => [
			`${rootFile}.ts`,
			`${nestedFile}.ts`
		];

		contentLoader.appendContentLoaderHeader(expected);

		expected.append(
			`import * as _0 from "${goodDataEntryDirectory}/${rootFile}";\n`
		);
		expected.append(`modules["${rootFile}"] = _0;\n`);
		expected.append(
			`import * as _1 from "${goodDataEntryDirectory}/${nestedFile}";\n`
		);
		expected.append(`modules["${nestedFile}"] = _1;\n`);
		expected.append("content.loadModules(modules);");

		const virtualModule = await contentLoader.createVirtualModule(
			project.virtualModuleID,
			fileGetter
		);
		expect(virtualModule).toEqual(expected.toString());
	});

	it("should inject the content loader import", async () => {
		const fakeReader = async (): Promise<string> => "";
		const project = createFakeProject();

		const loaded = await contentLoader.injectLoader(
			project.paths.entry,
			fakeReader
		);
		expect(loaded.code).toEqual(
			`;\nimport "${INJECTED_PREFIX}${goodDataName}";`
		);
	});
});
