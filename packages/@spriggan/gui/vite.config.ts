import { sourcemapPlugin, vitestConfig } from "@spriggan/config/vite";
import { defineConfig, mergeConfig } from "vite";

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";

	return mergeConfig(
		vitestConfig,
		defineConfig({
			plugins: [sourcemapPlugin(isDev)]
		})
	);
});
