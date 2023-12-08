/* v8 ignore start */
import type { LoadResult } from "rollup";
import type { Plugin } from "vite";
import { ProjectContentLoader } from "../project/projectContentLoader.js";
import { ProjectManager } from "../project/projectManager.js";

/** Loads all game content from data projects. */
export const contentLoaderPlugin = (): Plugin => {
	const contentLoader = new ProjectContentLoader(ProjectManager.global);

	return {
		name: "Spriggan Content Loader Plugin",
		async load(id): Promise<LoadResult> {
			if (contentLoader.shouldInjectLoader(id))
				return contentLoader.injectLoader(id);
			if (contentLoader.shouldRespondWithVirtualModule(id))
				return contentLoader.createVirtualModule(id);
		},
		resolveId(id, importer) {
			if (contentLoader.shouldResolveID(id, importer)) return id;
			return null;
		}
	};
};
