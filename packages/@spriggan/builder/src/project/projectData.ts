import { parse } from "path";
import { INJECTED_PREFIX } from "../util/constants.js";
import { paths } from "../util/paths.js";
import type { ProjectType } from "./projectType.js";

export class ProjectData {
	files?: string[];
	paths: ProjectData.Paths;
	virtualModuleID: string;

	constructor(
		public name: string,
		public type: ProjectType,
		entryPoint: string
	) {
		this.virtualModuleID = ProjectData.generateVirtualModuleID(name);
		this.paths = ProjectData.generatePaths(name, entryPoint);
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
}

export declare module ProjectData {
	export interface Paths {
		entryDirectory: string;
		entryFileExtension: string;
		entryFileName: string;
		entry: string;
		root: string;
	}
}
