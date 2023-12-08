import {
	defineCoreProject,
	defineDataProject,
	defineGUIProject
} from "./project/projectDefiners.js";

export { defineCoreProject, defineDataProject, defineGUIProject };
export { chunkSplitterPlugin } from "./plugins/chunkSplitterPlugin.js";
export { contentLoaderPlugin } from "./plugins/contentLoaderPlugin.js";
export * from "./plugins/sourcemapPlugin.js";

defineCoreProject("@spriggan/bios");
defineCoreProject("@spriggan/core");
defineDataProject("@spriggan/data");
defineGUIProject("@spriggan/gui");

defineDataProject("@example/mod");
