/* eslint-disable @typescript-eslint/naming-convention */
import type { Linter } from "eslint";

export const commonConfig = {
	extends: ["prettier"],
	plugins: ["simple-import-sort", "import", "prettier"],
	parserOptions: {
		ecmaVersion: "latest"
	},
	rules: {
		// Disable
		"no-duplicate-imports": "off",
		"no-unused-vars": "off",
		"no-useless-constructor": "off",
		"sort-imports": "off",

		// Set
		"lines-between-class-members": "warn",
		"import/first": "warn",
		// "import/no-duplicates": "warn",

		// Configure
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: true,
				peerDependencies: true,
				optionalDependencies: false
			}
		],
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"simple-import-sort/imports": [
			"warn",
			{
				groups: [["^\\u0000", "^[^.]", "^@", "^\\.\\.", "^\\."]]
			}
		],
		"spaced-comment": ["warn", "always", { markers: ["/"] }]
	}
} as Linter.BaseConfig;
