import { normalizePath, type Plugin } from "vite";
import { filters } from "../util/filters.js";

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
/* istanbul ignore next -- @preserve */
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
								case filters.guiContent(normalizedID):
									return "spriggan.gui";
								case filters.dataContent(normalizedID):
									return "spriggan.data";
								case filters.coreContent(normalizedID):
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
