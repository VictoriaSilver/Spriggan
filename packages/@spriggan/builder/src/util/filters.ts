import { createFilter } from "vite";
import { paths } from "./paths.js";

/** Provides filters for testing source file paths. */
export namespace filters {
	/** The index.html file of the GUI. */
	export const indexHtml = createFilter("index.html", null, {
		resolve: paths.gui
	});

	/** All third-party content files. */
	export const vendorContent = createFilter(["**/node_modules/**"], null, {
		resolve: paths.root
	});
}
