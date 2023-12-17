/* v8 ignore start */
import { normalizePath, type Plugin } from "vite";
import { ProjectManager } from "../project/projectManager.js";

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

						entryFileNames: "assets/[name].js",
						chunkFileNames: "assets/[name].js",
						assetFileNames: "assets/[name][extname]",
						manualChunks(chunkID) {
							const normalizedID = normalizePath(chunkID);

							return ProjectManager.global.nameChunk(normalizedID);
						}
					}
				}
			}
		};
	}
});
