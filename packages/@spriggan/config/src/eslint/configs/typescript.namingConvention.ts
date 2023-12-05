import type { Linter } from "eslint";

type Format =
	| "camelCase"
	| "strictCamelCase"
	| "PascalCase"
	| "StrictPascalCase"
	| "snake_case"
	| "UPPER_CASE";

interface Options {
	selector: string | string[];
	format: Format | Format[];
	leadingUnderscore?:
		| "forbid"
		| "require"
		| "requireDouble"
		| "allow"
		| "allowDouble"
		| "allowSingleOrDouble";
	trailingUnderscore?:
		| "forbid"
		| "require"
		| "requireDouble"
		| "allow"
		| "allowDouble"
		| "allowSingleOrDouble";
	filter?:
		| string
		| {
				regex: string;
				match: boolean;
		  };
	modifiers?: string[];
}

export function namingConvention(): Linter.RuleLevelAndOptions<[...Options[]]> {
	return [
		"warn",
		{
			selector: "default",
			format: ["camelCase"],
			filter: {
				regex: "^__(dir|file)name$",
				match: false
			}
		},
		{
			selector: "import",
			format: ["camelCase", "PascalCase"]
		},
		{
			// Camel-case or upper-snake-case variables
			selector: "variable",
			format: ["camelCase", "UPPER_CASE"]
		},
		{
			// Camel-case parameters
			selector: "parameter",
			format: ["camelCase"], // Allow leading underscores for private
			// parameter properties
			leadingUnderscore: "allow"
		},
		{
			// Camel-case with a leading underscore for private class
			// members
			selector: "memberLike",
			modifiers: ["private"],
			format: ["camelCase"],
			leadingUnderscore: "require"
		},
		{
			// Allow static members to be upper-snake-case
			selector: "memberLike",
			modifiers: ["static"],
			format: ["camelCase", "UPPER_CASE"]
		},
		{
			// Pascal-case classes/etc
			selector: "typeLike",
			format: ["PascalCase"]
		},
		{
			// Upper-snake-case for enum members
			selector: "enumMember",
			format: ["UPPER_CASE"]
		},
		{
			// Allow both camel-case and Pascal-case for functions
			selector: "function",
			format: ["camelCase", "PascalCase"]
		},
		{
			selector: "objectLiteralProperty",
			format: ["camelCase", "PascalCase", "UPPER_CASE"],
			leadingUnderscore: "allow"
		}
	];
}
