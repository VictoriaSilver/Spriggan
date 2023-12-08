import { pathToFileURL } from "url";
import { paths } from "./paths.js";

describe("paths", () => {
	const localFile = import.meta.url.toString();

	it("should correctly resolve", () => {
		const fromPackages = pathToFileURL(
			paths.fromPackages("@spriggan/builder/src/util/paths.spec.ts")
		).toString();

		expect(fromPackages).toEqual(localFile);
	});
});
