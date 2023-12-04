import { relative, resolve } from "path";
import { fileURLToPath } from "url";
import { normalizePath } from "vite";

export namespace paths {
	/**
	 * The root directory of the Spriggan monorepo.
	 */
	export const root = normalizePath(
		fileURLToPath(new URL("../../../../../../", import.meta.url))
	);

	/**
	 * Resolve a path, then normalize it to use forward slashes.
	 */
	export const resolveNormalized = (
		base: string,
		path: string,
		...rest: string[]
	): string => normalizePath(resolve(base, path, ...rest));

	/**
	 * Solve the relative path from {@link from} to {@link to},
	 * then normalize it to use forward slashes.
	 */
	export const relativeNormalized = (from: string, to: string): string =>
		normalizePath(relative(from, to));

	/**
	 * Resolve a path relative to the monorepo root.
	 */
	export const fromRoot = (path: string): string =>
		resolveNormalized(root, path);

	/**
	 * Resolve a path relative to the `packages` directory in the monorepo root.
	 */
	export const fromPackages = (path: string): string =>
		resolveNormalized(packages, path);

	/**
	 * The `packages` directory in the monorepo root.
	 */
	export const packages = fromRoot("packages");

	/**
	 * The directory of Spriggan's core.
	 */
	export const core = fromPackages("@spriggan/core");

	/**
	 * The directory of Spriggan's game data.
	 */
	export const data = fromPackages("@spriggan/data");

	/**
	 * The directory of Spriggan's GUI.
	 */
	export const gui = fromPackages("@spriggan/gui");

	/**
	 * Globs for including and excluding content files.
	 */
	export namespace target {
		export const extensions = "ts,tsx";
		export const include = `**/*.{${extensions}}`;
		export const exclude = `**/*.spec.{${extensions}}`;
	}
}
