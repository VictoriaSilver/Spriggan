import { defineConfig } from "vitest/config";

export const vitestConfig = defineConfig({
	test: {
		globals: true,
		watch: false,
		passWithNoTests: true,
		include: ["src/**/*.spec.ts"],
		coverage: {
			reportsDirectory: "coverage",
			provider: "istanbul",
			reporter: ["text", "html", "cobertura"]
		}
	}
});
