import { ProjectData } from "./projectData.js";
import type { ProjectManager } from "./projectManager.js";
import type { ProjectType } from "./projectType.js";

export function defineProject(
	projectManager: ProjectManager,
	name: string,
	type: ProjectType,
	entryPoint = "src/index.ts"
): ProjectData {
	const result = new ProjectData(name, type, entryPoint);
	projectManager.knownProjects.push(result);
	return result;
}
