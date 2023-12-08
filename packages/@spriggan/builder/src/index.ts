import { defineProject } from "./project/projectDefiners.js";
import { ProjectManager } from "./project/projectManager.js";
import { ProjectType } from "./project/projectType.js";

export { chunkSplitterPlugin } from "./plugins/chunkSplitterPlugin.js";
export { contentLoaderPlugin } from "./plugins/contentLoaderPlugin.js";
export * from "./plugins/sourcemapPlugin.js";

defineProject(ProjectManager.global, "@spriggan/bios", ProjectType.CORE);
defineProject(ProjectManager.global, "@spriggan/core", ProjectType.CORE);
defineProject(ProjectManager.global, "@spriggan/data", ProjectType.DATA);
defineProject(ProjectManager.global, "@spriggan/gui", ProjectType.GUI);
