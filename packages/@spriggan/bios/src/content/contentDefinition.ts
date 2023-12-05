import { CONTENT_IDENTITY } from "./contentSymbols";

/** The base class of all game content definitions. */
export abstract class ContentDefinition {
	/** Stores the ID assigned to this content. */
	static [CONTENT_IDENTITY]: string | undefined;
}
