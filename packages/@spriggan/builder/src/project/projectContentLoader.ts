import glob from "fast-glob";
import type { PathLike } from "fs";
import { readFile } from "fs/promises";
import MagicString, { type SourceMap } from "magic-string";
import { dirname, parse } from "path";
import { INJECTED_PREFIX } from "../util/constants.js";
import { filters } from "../util/filters.js";
import { paths } from "../util/paths.js";
import { ProjectDataMissingError } from "./errors/projectDataMissingError.js";
import type { ProjectData } from "./projectData.js";
import type { ProjectManager } from "./projectManager.js";

export type InjectionResult = { code: string; map: SourceMap };
export type ProjectFileGetter = (projectData: ProjectData) => Promise<string[]>;
export type ProjectFileReader = (
	file: PathLike,
	encoding: BufferEncoding
) => Promise<string>;

/* v8 ignore start */
const defaultProjectFileGetter: ProjectFileGetter = (project) =>
	glob(
		[
			paths.target.include,
			`!${project.paths.entryFileName}${project.paths.entryFileExtension}`,
			`!${paths.target.exclude}`
		],
		{ cwd: project.paths.entryDirectory }
	);

/* v8 ignore stop */

export class ProjectContentLoader {
	constructor(public projectManager: ProjectManager) {}

	/**
	 * Determine whether a file is a data entry which should have the content
	 * loader injected.
	 */
	shouldInjectLoader(file: string): boolean {
		return filters.dataEntry(file);
	}

	/**
	 * Determine whether to generate a virtual module.
	 */
	shouldRespondWithVirtualModule(id: string): boolean {
		return id.startsWith(INJECTED_PREFIX);
	}

	/**
	 * Determine whether the importer is a data entry and the intended import
	 * is a virtual content module.
	 */
	shouldResolveID(id: string, importer: string | undefined): boolean {
		return filters.dataEntry(importer) && id.startsWith(INJECTED_PREFIX);
	}

	/** Appends an import for the content loader. */
	appendContentLoaderHeader(magic: MagicString): void {
		magic.append(`import { content } from "@spriggan/core";\n`);
		magic.append("const modules = {};\n");
	}

	/**
	 * Creates a MagicString from code and appends an import for a virtual
	 * content loader module.
	 */
	appendLoaderCode(
		code: string,
		entryFile: string,
		virtualModuleID: string
	): MagicString {
		const magic = new MagicString(code, {
			filename: entryFile
		});

		magic.append(`;\nimport "${virtualModuleID}";`);

		return magic;
	}

	/**
	 * Generates the code for the virtual module which imports the game content.
	 */
	async createVirtualModule(
		id: string,
		getFiles: ProjectFileGetter = defaultProjectFileGetter
	): Promise<string> {
		const projectData = this.projectManager.findProjectByVirtualModuleID(id);
		if (!projectData) throw new ProjectDataMissingError("virtual module", id);

		const magic = new MagicString("");

		projectData.files ??= await getFiles(projectData);

		this.generateContentImports(
			magic,
			projectData.paths.entryDirectory,
			projectData.files!
		);

		return magic.toString();
	}

	/**
	 * Generates imports for {@link contentFiles}, and passes them to the content
	 * loader.
	 */
	generateContentImports(
		magic: MagicString,
		entryDirectory: string,
		contentFiles: string[]
	): void {
		this.appendContentLoaderHeader(magic);

		for (let i = 0; i < contentFiles.length; i++) {
			const inputFile = contentFiles[i]!;

			const inputDirectory = dirname(inputFile);
			const absoluteFile = `${entryDirectory}/${inputFile}`;
			const { dir: relativeDirectory, name } = parse(absoluteFile);

			const importFilePath = `${relativeDirectory}/${name}`;
			const storageFilePath = `${inputDirectory}/${name}`.replace(/^\.\//, "");

			magic.append(`import * as _${i} from "${importFilePath}";\n`);
			magic.append(`modules["${storageFilePath}"] = _${i};\n`);
		}

		magic.append("content.loadModules(modules);");
	}

	/**
	 * Injects an import for the virtual module which will load the game content.
	 */
	async injectLoader(
		entryFile: string,
		fileReader: ProjectFileReader = readFile
	): Promise<InjectionResult> {
		const projectData = this.projectManager.findProjectByEntryPoint(entryFile);
		if (!projectData)
			throw new ProjectDataMissingError("entry file", entryFile);

		const entryCode = await fileReader(entryFile, "utf-8");
		const appendedCode = this.appendLoaderCode(
			entryCode,
			entryFile,
			projectData.virtualModuleID
		);

		return {
			code: appendedCode.toString(),
			map: appendedCode.generateMap({
				source: entryFile,
				includeContent: true,
				hires: true
			})
		};
	}
}
