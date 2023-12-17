import { filters } from "./filters";
import { paths } from "./paths";

describe("filters", () => {
	it("should mark anything under node_modules as vendor", () => {
		const module = "@group/project/node_modules/dependency";
		const path = paths.fromRoot(`${module}/dist/index.js`);

		expect(filters.vendorContent(path)).toEqual(true);
	});
});
