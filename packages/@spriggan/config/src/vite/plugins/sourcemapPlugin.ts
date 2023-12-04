/* v8 ignore start */
import type { Plugin } from "vite";

/** A Vite plugin for enabling sourcemaps only during development. */
export const sourcemapPlugin = (isDev: boolean): Plugin => ({
	name: "Spriggan Sourcemap Plugin",
	config() {
		return {
			build: {
				sourcemap: isDev
			}
		};
	}
});
