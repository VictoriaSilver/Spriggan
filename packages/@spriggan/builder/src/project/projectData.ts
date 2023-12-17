import { parse } from "path";
import { createFilter } from "vite";
import { INJECTED_PREFIX } from "../util/constants.js";
import { paths } from "../util/paths.js";
import type { ProjectType } from "./projectType.js";

type Filter = (id: string | unknown) => boolean;

export class ProjectData {
	chunkName: string;
	files?: string[];
	filters: ProjectData.Filters;
	paths: ProjectData.Paths;
	virtualModuleID: string;

	constructor(
		public name: string,
		public type: ProjectType,
		entryPoint: string
	) {
		this.chunkName = ProjectData.generateChunkName(name);
		this.virtualModuleID = ProjectData.generateVirtualModuleID(name);
		this.paths = ProjectData.generatePaths(name, entryPoint);
		this.filters = ProjectData.generateFilters(this.paths);
	}

	static generateChunkName(name: string): string {
		return name.startsWith("@") ? name.slice(1).replace("/", ".") : name;
	}

	static generateVirtualModuleID(name: string): string {
		return `${INJECTED_PREFIX}${name}`;
	}

	static generatePaths(name: string, entryPoint: string): ProjectData.Paths {
		const root = paths.fromPackages(name);
		const entry = paths.resolveNormalized(root, entryPoint);
		const {
			dir: entryDirectory,
			name: entryFileName,
			ext: entryFileExtension
		} = parse(entry);

		return {
			root,
			entry,
			entryDirectory,
			entryFileName,
			entryFileExtension
		};
	}

	static generateFilters(projectPaths: ProjectData.Paths): ProjectData.Filters {
		return {
			allContent: createFilter(
				[...paths.target.include],
				[...paths.target.exclude],
				{
					resolve: projectPaths.entryDirectory
				}
			),
			allNonEntryContent: createFilter(
				[...paths.target.include],
				[...paths.target.exclude, projectPaths.entry],
				{
					resolve: projectPaths.entryDirectory
				}
			),
			allProjectFiles: createFilter("./**/*", [], {
				resolve: projectPaths.root
			})
		};
	}

	ownsFile(id: string, useRoot = false): boolean {
		return (useRoot ? this.filters.allProjectFiles : this.filters.allContent)(
			id
		);
	}
}

export declare module ProjectData {
	export interface Paths {
		entryDirectory: string;
		entryFileExtension: string;
		entryFileName: string;
		entry: string;
		root: string;
	}

	export interface Filters {
		/**
		 * All files in the same directory as the entry file, as well as its
		 * subdirectories, which match {@link paths.target.include} but not
		 * {@link paths.target.exclude}.
		 */
		allContent: Filter;
		/**
		 * All files in the same directory as the entry file which aren't the entry
		 * file, as well as its subdirectories, which match
		 * {@link paths.target.include} but not {@link paths.target.exclude}.
		 */
		allNonEntryContent: Filter;
		/**
		 * *All* files contained within the project's directory and subdirectories.
		 */
		allProjectFiles: Filter;
	}
}
