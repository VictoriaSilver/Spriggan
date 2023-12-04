import { FlatCompat } from "@eslint/eslintrc";
import type { Linter } from "eslint";
import { typescriptOverride } from "./configs/typescript.js";

const compat = new FlatCompat();

export default [
	{
		ignores: ["coverage", "dist", "docs", "node_modules"].map(
			(d) => `**/${d}/*`
		)
	},
	...compat.plugins("prettier"),
	...compat.config({
		extends: "prettier",
		plugins: ["simple-import-sort", "import", "prettier"]
	}),
	...compat.config({
		overrides: [typescriptOverride]
	})
] as Linter.FlatConfig[];
