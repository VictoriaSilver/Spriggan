import { nameVendorChunk } from "./chunkSplitterPlugin";

describe("chunkSplitterPlugin", () => {
	const dependency = "project";
	const group = "groupName";
	const file = "dist/index.js";

	it("should correctly name simple vendor chunks", () => {
		const chunk = nameVendorChunk(`X:/node_modules/${dependency}/${file}`);
		expect(chunk).toEqual(`vendor/${dependency}`);
	});

	it("should correctly name grouped vendor chunks", () => {
		const chunk = nameVendorChunk(
			`X:/node_modules/@${group}/${dependency}/${file}`
		);
		expect(chunk).toEqual(`vendor/${group}.${dependency}`);
	});
});
