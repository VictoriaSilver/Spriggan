/* eslint-disable @typescript-eslint/naming-convention */
import type { Linter } from "eslint";
import { commonConfig } from "./common.js";
import { namingConvention } from "./typescript.namingConvention.js";

export const typescriptOverride: Linter.ConfigOverride = {
	files: ["*.ts", "*.tsx"],
	...commonConfig,
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:import/typescript",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		...(commonConfig.extends as string[])
	],
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"]
		},
		"import/resolver": {
			node: {
				extensions: [".ts", ".tsx", ".js", ".cjs"]
			},
			typescript: {
				alwaysTryTypes: true,
				project: [
					"tsconfig.json",
					"packages/*/tsconfig.json",
					"packages/*/tsconfig.*.json"
				]
			}
		}
	},
	rules: {
		...commonConfig.rules,
		"@typescript-eslint/naming-convention": namingConvention(),
		// Annoying
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/typedef": "off",
		"lines-between-class-members": "off",

		// Allows for better organization
		"@typescript-eslint/no-namespace": "off",

		// Configure
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports"
			}
		],
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				// Annoying
				allowExpressions: true
			}
		],
		"@typescript-eslint/member-ordering": [
			"warn",
			{
				default: [
					"signature",
					"call-signature",

					"public-static-field",
					"protected-static-field",
					"private-static-field",
					"#private-static-field",

					"public-instance-field",
					"protected-instance-field",
					"private-instance-field",
					"#private-instance-field",

					"public-abstract-field",
					"protected-abstract-field",

					"public-field",
					"protected-field",
					"private-field",
					"#private-field",

					"static-field",
					"instance-field",
					"abstract-field",

					"field",
					"static-initialization",
					"public-constructor",
					"protected-constructor",
					"private-constructor",

					"constructor",
					["static-get", "static-set"],
					["get", "set"],
					"public-static-method",
					"protected-static-method",
					"private-static-method",
					"#private-static-method",

					"public-instance-method",
					"protected-instance-method",
					"private-instance-method",
					"#private-instance-method",

					"public-abstract-method",
					"protected-abstract-method",

					"public-method",
					"protected-method",
					"private-method",
					"#private-method",

					"static-method",
					"instance-method",
					"abstract-method",

					"method"
				]
			}
		]
	}
};
