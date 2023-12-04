import { filters } from "./filters";
import { paths } from "./paths";

describe("filters", () => {
	it("should mark anything under node_modules as vendor", () => {
		const module = "@group/project/node_modules/dependency";
		const path = paths.fromRoot(`${module}/dist/index.js`);

		expect(filters.vendorContent(path)).toEqual(true);
	});

	describe("createSourceFilter", () => {
		it("should include only files under src/ in the project root", () => {
			const projectRoot = paths.fromPackages("@group/project");
			const otherRoot = paths.fromPackages("@group/otherProject");
			const projectFilter = filters.createSourceFilter(projectRoot);

			const goodSource = `${projectRoot}/src/${Math.random()}.ts`;
			expect(projectFilter(goodSource)).toEqual(true);

			const badSource = `${otherRoot}/src/${Math.random()}.ts`;
			expect(projectFilter(badSource)).toEqual(false);

			const notSource = `${projectRoot}/out/${Math.random()}.js`;
			expect(projectFilter(notSource)).toEqual(false);
		});
	});
});
