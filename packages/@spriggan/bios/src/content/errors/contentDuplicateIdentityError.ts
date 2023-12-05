import type { ContentDefinition } from "../contentDefinition";

/** Thrown when adding content to a registry when the ID is already used. */
export class ContentDuplicateIdentityError extends Error {
	constructor(
		public readonly id: string,
		public readonly content: typeof ContentDefinition
	) {
		super(`Attempted to assign a previously-assigned ID: ${id}`);
	}
}
