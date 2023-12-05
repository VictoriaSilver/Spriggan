import glob from "fast-glob";
import { readFile } from "fs/promises";
import MagicString from "magic-string";
import { dirname, parse } from "path";
import type { LoadResult } from "rollup";
import type { Plugin } from "vite";
import { filters } from "../util/filters.js";
import { paths } from "../util/paths.js";
import { ContentLoaderMissingDataError } from "./errors.js";

export const INJECTED_PREFIX = "\0/spriggan/content/";
const knownProjects: KnownProjects = {};

export type KnownProjects = Record<string, KnownProject>;
export type ProjectFileGetter = (
	projectData: KnownProject
) => Promise<string[]>;

export interface KnownProject {
	entryDirectory: string;
	entryFileExtension: string;
	entryFileName: string;
	projectRoot: string;
	projectName: string;
	files?: string[];
}

/* v8 ignore start - Currently impractical to test */
/** Loads all game content from data projects. */
export const contentLoaderPlugin = (): Plugin => ({
	name: "Spriggan Content Loader Plugin",
	async load(id) {
		if (shouldInjectLoader(id)) return injectLoader(id, knownProjects);
		if (shouldRespondWithVirtualModule(id))
			return createVirtualModule(id, knownProjects);
	},
	resolveId(id, importer) {
		if (shouldResolveID(id, importer)) return id;
		return null;
	}
});

/**
 * Injects an import for the virtual module which will load the game content.
 */
export async function injectLoader(
	entryFile: string,
	knownProjects: KnownProjects
): Promise<LoadResult> {
	const virtualModuleID = cacheProjectData(entryFile, knownProjects);
	const entryCode = await readFile(entryFile, "utf-8");
	const appendedCode = appendLoaderCode(entryCode, entryFile, virtualModuleID);

	return {
		code: appendedCode.toString(),
		map: appendedCode.generateMap({
			source: entryFile,
			includeContent: true,
			hires: true
		})
	};
}

const defaultProjectFileGetter: ProjectFileGetter = (project) =>
	glob(
		[
			paths.target.include,
			`!${project.entryFileName}${project.entryFileExtension}`,
			`!${paths.target.exclude}`
		],
		{ cwd: project.entryDirectory }
	);

/* v8 ignore stop */

/**
 * Generates the code for the virtual module which imports the game content.
 */
export async function createVirtualModule(
	virtualModuleID: string,
	knownProjects: KnownProjects,
	getFiles: ProjectFileGetter = defaultProjectFileGetter
): Promise<string> {
	const magic = new MagicString("");
	const projectData = knownProjects[virtualModuleID];
	if (!projectData) throw new ContentLoaderMissingDataError(virtualModuleID);

	const { entryDirectory } = projectData;

	projectData.files ??= await getFiles(projectData);

	generateContentImports(magic, entryDirectory, projectData.files!);

	return magic.toString();
}

/**
 * Caches a project's filesystem information and generates an ID for its
 * virtual module.
 * @returns The project's virtual module ID
 */
export function cacheProjectData(
	entryFile: string,
	knownProjects: KnownProjects
): string {
	const projectData = generateProjectData(entryFile);
	const virtualModuleID = generateVirtualModuleID(projectData.projectName);

	knownProjects[virtualModuleID] = projectData;
	return virtualModuleID;
}

/** Appends an import for the content loader. */
export function appendContentLoaderHeader(magic: MagicString): void {
	magic.append(`import { content } from "@spriggan/core";\n`);
	magic.append("const modules = {};\n");
}

/**
 * Generates imports for {@link contentFiles}, and passes them to the content
 * loader.
 */
export function generateContentImports(
	magic: MagicString,
	entryDirectory: string,
	contentFiles: string[]
): void {
	appendContentLoaderHeader(magic);

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
 * Determine whether the importer is a data entry and the intended import
 * is a virtual content module.
 */
export function shouldResolveID(
	id: string,
	importer: string | undefined
): boolean {
	return filters.dataEntry(importer) && id.startsWith(INJECTED_PREFIX);
}

/**
 * Determine whether a file is a data entry which should have the content
 * loader injected.
 */
export function shouldInjectLoader(file: string): boolean {
	return filters.dataEntry(file);
}

/**
 * Determine whether to generate a virtual module.
 */
export function shouldRespondWithVirtualModule(id: string): boolean {
	return id.startsWith(INJECTED_PREFIX);
}

/**
 * Cache a project's filesystem data.
 */
export function generateProjectData(entryFile: string): KnownProject {
	const {
		dir: entryDirectory,
		name: entryFileName,
		ext: entryFileExtension
	} = parse(entryFile);

	const projectRoot = paths.resolveNormalized(entryDirectory, "..");
	const projectName = paths.relativeNormalized(paths.packages, projectRoot);

	return {
		entryDirectory,
		entryFileName,
		entryFileExtension,
		projectName,
		projectRoot
	};
}

/**
 * Generates a virtual module ID for a project.
 */
export function generateVirtualModuleID(projectName: string): string {
	return `${INJECTED_PREFIX}${projectName}`;
}

/**
 * Creates a MagicString from code and appends an import for a virtual
 * content loader module.
 */
export function appendLoaderCode(
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
