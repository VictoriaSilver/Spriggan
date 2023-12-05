import { ContentDefinition } from "./contentDefinition";
import { CONTENT_IDENTITY } from "./contentSymbols";
import { ContentDuplicateIdentityError } from "./errors";

/** Values exported from a Javascript module. */
type ModuleExports = Record<string, unknown>;

/**
 * The exports of imported Javascript modules stored against their import path.
 */
interface IncomingModules {
	[filePath: string]: ModuleExports;
}

export class ContentRegistry {
	private _entries: Record<string, typeof ContentDefinition> = {};

	/**
	 * @param id The identity to assign to the content.
	 * @param content The content being added.
	 * @throws {ContentDuplicateIdentityError} when {@link id} is already
	 * assigned.
	 */
	add(id: string, content: typeof ContentDefinition): void {
		if (id in this._entries)
			throw new ContentDuplicateIdentityError(id, content);

		this._entries[id] = content;
		content[CONTENT_IDENTITY] = id;
	}

	/** Generate an ID for content at a location. */
	generateID(path: string, exportedName: string): string {
		const lastSlashIndex = path.lastIndexOf("/");
		if (lastSlashIndex === -1) return exportedName;

		const namespace = path.substring(0, lastSlashIndex);
		return `${namespace}:${exportedName}`;
	}

	/**
	 * Get the content identity of a content definition, if it has one.
	 * @returns `null` if no identity is assigned.
	 */
	identify(definition: typeof ContentDefinition): string | null;
	/**
	 * Get the content identity of a content instance, if it has one.
	 * @returns `null` if no identity is assigned.
	 */
	identify(instance: ContentDefinition): string | null;
	identify(input: ContentDefinition | typeof ContentDefinition): string | null {
		if (this.isContentDefinition(input)) return input[CONTENT_IDENTITY] ?? null;
		if (
			this.isContentDefinition(input.constructor) &&
			Object.hasOwn(input.constructor, CONTENT_IDENTITY)
		)
			return input.constructor[CONTENT_IDENTITY] ?? null;
		return null;
	}

	/** Determine whether a value is a content definition. */
	isContentDefinition(input: unknown): input is typeof ContentDefinition {
		if (input === null || input === undefined) return false;
		return (
			typeof input === "function" &&
			input.prototype instanceof ContentDefinition
		);
	}

	/**
	 * Identify and load content from a collection of modules.
	 * @param modules The modules being loaded.
	 */
	loadModules(modules: IncomingModules): void {
		for (const filePath in modules) {
			const module = modules[filePath];
			for (const exportedKey in module) {
				const exportedValue = module[exportedKey];
				if (this.isContentDefinition(exportedValue)) {
					const id = this.generateID(filePath, exportedKey);
					this.add(id, exportedValue);
				}
			}
		}
	}

	/** Get registered content from this registry. */
	resolve<T extends typeof ContentDefinition>(id: string): T | null {
		return (this._entries[id] as T) ?? null;
	}
}
