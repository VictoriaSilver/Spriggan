import { defineConfig } from "vitest/config";

/* istanbul ignore file -- @preserve */
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
			provider: "istanbul",
			reporter: ["text", "html", "cobertura"]
		}
	}
});
