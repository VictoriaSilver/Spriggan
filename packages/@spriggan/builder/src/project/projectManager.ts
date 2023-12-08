import type { ProjectData } from "./projectData.js";

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
}
