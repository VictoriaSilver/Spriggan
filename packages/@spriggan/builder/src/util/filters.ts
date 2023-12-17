import { createFilter } from "vite";
import { paths } from "./paths.js";

/** Provides filters for testing source file paths. */
export namespace filters {
	/** All third-party content files. */
	export const vendorContent = createFilter(["**/node_modules/**"], null, {
		resolve: paths.root
	});
}
