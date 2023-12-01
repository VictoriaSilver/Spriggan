import type { Plugin } from "vite";

/** A Vite plugin for enabling sourcemaps only during development. */
/* istanbul ignore next -- @preserve */
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
