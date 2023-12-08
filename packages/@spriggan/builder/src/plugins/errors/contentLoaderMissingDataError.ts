/**
 * Thrown when a project is missing from knownProjects in
 * {@link createVirtualModule}
 */
export class ContentLoaderMissingDataError extends Error {
	constructor(public readonly virtualModuleID: string) {
		super(
			`The project "${virtualModuleID}" is missing data from injectLoader.`
		);
	}
}
