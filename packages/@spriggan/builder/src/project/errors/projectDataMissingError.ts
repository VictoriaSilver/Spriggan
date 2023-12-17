export class ProjectDataMissingError extends Error {
	constructor(
		public readonly inputType: string,
		public readonly input: string
	) {
		super(`The project using the ${inputType} "${input}" was not defined.`);
	}
}
