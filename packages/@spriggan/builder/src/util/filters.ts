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

	/** All third-party content files. */
	export const vendorContent = createFilter(["**/node_modules/**"], null, {
		resolve: paths.root
	});
}
