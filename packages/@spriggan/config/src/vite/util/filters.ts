import { createFilter } from "vite";
import { paths } from "./paths.js";

type Filter = (id: string | unknown) => boolean;

/** Provides filters for testing source file paths. */
export namespace filters {
	/** Create a filter that includes all source files of a project root. */
	export const createSourceFilter = (projectRoot: string): Filter =>
		createFilter(`src/${paths.target.include}`, paths.target.exclude, {
			resolve: projectRoot
		});

	/** The index.html file of the GUI. */
	export const indexHtml = createFilter("index.html", null, {
		resolve: paths.gui
	});

	/** All content files of the GUI. */
	export const guiContent = createSourceFilter(paths.gui);

	/** All content files of the core. */
	export const coreContent = createSourceFilter(paths.core);

	/** The entry point of the game data. */
	export const dataEntry = createFilter("src/index.ts", paths.target.exclude, {
		resolve: paths.data
	});

	/** All content files of the game data. */
	export const dataContent = createSourceFilter(paths.data);

	/** All third-party content files. */
	export const vendorContent = createFilter(["**/node_modules/**"], null, {
		resolve: paths.root
	});
}
