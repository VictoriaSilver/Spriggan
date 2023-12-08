import type { ProjectData } from "./projectData.js";
import { ProjectType } from "./projectType.js";

export class ProjectManager {
	static global = new ProjectManager();
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

	fileIsContentType(id: string | undefined, type: ProjectType): boolean {
		if (id === undefined) return false;
		return this.knownProjects.some(
			(p) => p.type === type && p.files!.includes(id)
		);
	}
}
