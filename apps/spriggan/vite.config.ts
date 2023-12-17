import {
	chunkSplitterPlugin,
	contentLoaderPlugin,
	defineDataProject,
	defineGUIProject,
	sourcemapPlugin
} from "@spriggan/builder";
import { vitestConfig } from "@spriggan/config/vite";
import { defineConfig, mergeConfig } from "vite";

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";

	defineGUIProject("@spriggan/gui");
	defineDataProject("@example/mod");

	return mergeConfig(
		vitestConfig,
		defineConfig({
			build: {
				rollupOptions: {
					input: { spriggan: "index.html" }
				}
			},
			plugins: [
				sourcemapPlugin(isDev),
				contentLoaderPlugin(),
				chunkSplitterPlugin()
			]
		})
	);
});
