import { ProjectData } from "./projectData.js";
import { ProjectManager } from "./projectManager.js";
import { ProjectType } from "./projectType.js";

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

export function defineCoreProject(
	name: string,
	entryPoint?: string
): ProjectData {
	return defineProject(
		ProjectManager.global,
		name,
		ProjectType.CORE,
		entryPoint
	);
}

export function defineDataProject(
	name: string,
	entryPoint?: string
): ProjectData {
	return defineProject(
		ProjectManager.global,
		name,
		ProjectType.DATA,
		entryPoint
	);
}

export function defineGUIProject(
	name: string,
	entryPoint?: string
): ProjectData {
	return defineProject(
		ProjectManager.global,
		name,
		ProjectType.DATA,
		entryPoint
	);
}
