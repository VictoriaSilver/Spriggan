import { createFilter } from "vite";
import { paths } from "../util/paths.js";
import type { ProjectData } from "./projectData.js";
import { ProjectType } from "./projectType.js";

export class ProjectManager {
	static global = new ProjectManager();
	static vendorFilter = createFilter(["**/node_modules/**"], null, {
		resolve: paths.root
	});
	knownProjects: ProjectData[] = [];

	findProjectByVirtualModuleID(virtualModuleID: string): ProjectData | null {
		return (
			this.knownProjects.find((p) => p.virtualModuleID === virtualModuleID) ??
			null
		);
	}

	findProjectByEntryPoint(entryPoint: string): ProjectData | null {
		return this.knownProjects.find((p) => p.paths.entry === entryPoint) ?? null;
	}

	fileIsDataEntry(id: string | undefined): boolean {
		if (id === undefined) return false;
		return this.knownProjects.some(
			(p) => p.type === ProjectType.DATA && p.paths.entry === id
		);
	}

	nameChunk(id: string): string | null {
		if (ProjectManager.vendorFilter(id)) return this.nameVendorChunk(id);

		const matchingProject = this.knownProjects.find((p) =>
			p.ownsFile(id, true)
		);

		return matchingProject?.chunkName ?? null;
	}

	nameVendorChunk(chunkID: string): string {
		// node_modules/dependency/...	-> dependency/...
		let name = chunkID.slice(
			chunkID.lastIndexOf("node_modules") + "node_modules".length + 1
		);
		// @group/project/... 	->	group.project/...
		if (name.startsWith("@")) name = name.slice(1).replace("/", ".");
		// dependency/...	->	dependency
		name = name.slice(0, name.indexOf("/"));

		return `vendor/${name}`;
	}
}
