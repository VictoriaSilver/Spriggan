/* v8 ignore start */
import { normalizePath, type Plugin } from "vite";
import { filters } from "../util/filters.js";
import { ProjectManager } from "../project/projectManager.js";
import { ProjectType } from "../project/projectType.js";

/**
 * Splits chunks by purpose and origin.
 *
 * Project files are placed in `/assets`
 *
 * 	- `@spriggan/core` becomes `/assets/spriggan.core.js`
 *
 * Vendor files are placed in `/vendor`
 *
 * 	- `@vue/shared` becomes `/vendor/vue.shared.js`
 *
 * 	- `vue` becomes `/vendor/vue.js`
 */
export const chunkSplitterPlugin = (): Plugin => ({
	name: "Spriggan Chunk Splitter Plugin",
	config() {
		return {
			build: {
				modulePreload: false,
				rollupOptions: {
					treeshake: false,
					output: {
						hoistTransitiveImports: false,
						inlineDynamicImports: false,

						chunkFileNames: "assets/[name].js",
						assetFileNames: "assets/[name][extname]",
						manualChunks(chunkID) {
							const normalizedID = normalizePath(chunkID);

							switch (true) {
								case filters.vendorContent(normalizedID):
									return nameVendorChunk(normalizedID);
								case filters.indexHtml(normalizedID):
								case ProjectManager.global.fileIsContentType(
									normalizedID,
									ProjectType.GUI
								):
									return "spriggan.gui";
								case ProjectManager.global.fileIsContentType(
									normalizedID,
									ProjectType.DATA
								):
									return "spriggan.data";
								case ProjectManager.global.fileIsContentType(
									normalizedID,
									ProjectType.CORE
								):
									return "spriggan.core";
							}

							return null;
						}
					}
				}
			}
		};
	}
});

export function nameVendorChunk(chunkID: string): string {
	// node_modules/dependency/...	-> dependency/...
	let name = chunkID.slice(
		chunkID.lastIndexOf("node_modules") + "node_modules".length + 1
	);
	// @group/project/... 	->	group.project/...
	if (name.startsWith("@")) name = name.slice(1).replace("/", ".");
	// dependency/...	->	dependency
	name = name.slice(0, name.indexOf("/"));

	return `vendor/${name}`;
}
