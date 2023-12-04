/* v8 ignore start */
import { defineConfig } from "vitest/config";

export const vitestConfig = defineConfig({
	test: {
		globals: true,
		watch: false,
		passWithNoTests: true,
		include: ["src/**/*.spec.ts"],
		typecheck: {
			checker: "tsc",
			tsconfig: "tsconfig.spec.json"
		},
		coverage: {
			all: true,
			include: ["src/**"],
			reporter: ["text", "html", "cobertura"]
		}
	}
});
