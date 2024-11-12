export class InvalidWikiPathError extends Error {
    constructor (wikiPath: string) {
        super(`${wikiPath} is not a valid wiki path. Wiki paths must be lowercase and may only contain letters, numbers, underscores, hyphens, and slashes. They must not start or end with a slash, and must not start with "wiki/".`);
        this.name = "InvalidWikiPathError";
    }
}

// These paths and their children are considered dangerous and should be handled with care.
export const dangerousPaths = [
    "wiki", // This should fail validation, but we'll include it here just in case
    "config", // Native Reddit config pages
    "tbsettings", // Toolbox settings
    "toolbox", // Toolbox settings
    "usernotes", // Toolbox usernotes
    "index", // Wiki index
    "pages", // Wiki pages list
    "botconfig", // Bot configuration, used as the root by contextmodbot and others
    "my_page", // Used as an example in the wiki page path help text
    "automoderator", // Legacy automoderator config
    "automoderator-schedule",

    // Various other bot configs
    "contexbot",
    "contextbot",
    "magic_eye",
    "mediamodbotconfig",
    "moderatelyhelpfulbot",
    "moderatelyusefulbot",
    "repost_sleuth_config",
    "repost_master",
    "flair_helper",
    "safestbot",
    "removalflairs",
];

export class WikiPath {
    /**
     * The current wiki path after pre-processing and validation.
     */
    readonly path: string;

    private _tree?: string[];
    private _parents?: string[];

    /**
     * Ordered array of each page in the path (e.g. ["first", "first/second", "first/second/third"] for "first/second/third").
     */
    get tree (): string[] {
        if (!this._tree) {
            if (!this.path.includes("/")) {
                this._tree = [this.path];
            } else {
                const pathSegments = this.path.split("/");
                let currentPath = "";
                this._tree = pathSegments.map(segment => {
                    currentPath = currentPath ? `${currentPath}/${segment}` : segment;
                    return currentPath;
                });
            }
        }
        return this._tree;
    }

    /**
     * Ordered array of the parent paths of the path (e.g. ["first", "first/second"] for "first/second/third").
     */
    get parents (): string[] {
        if (!this._parents) {
            this._parents = this.tree.slice(0, this.tree.length - 1);
        }
        return this._parents;
    }

    /**
     * Gets the immediate parent of the path (e.g. "second" in "first/second/third"). Undefined if this is the root of the tree.
     */
    get parent (): string | undefined {
        return this.parents[this.parents.length - 1];
    }

    /**
     * Returns true if the path has no parents (e.g. "first" in "first/second" has no parents, but "first/second" does).
     */
    get isTreeRoot (): boolean {
        return this.tree.length === 1;
    }

    /**
     * The root of the tree is the first segment of the path (e.g. "first" in "first/second/third").
     */
    get treeRoot (): string {
        return this.tree[0];
    }

    /**
     * Returns true if the path points to a potentially dangerous page (e.g. "config/*", "tbsettings", or some other known config pages).
     */
    get isDangerous (): boolean {
        return dangerousPaths.includes(this.treeRoot);
    }

    /**
     * Creates a new WikiPath object. The provided path will be pre-processed and validated.
     * @param wikiPath The wiki path to create
     * @throws {InvalidWikiPathError} The wiki path must pass validation
     */
    constructor (wikiPath: string) {
        this.path = WikiPath.preProcessWikiPath(wikiPath);
        if (!WikiPath.isValidWikiPath(this.path)) {
            throw new InvalidWikiPathError(this.path);
        }
    }

    /**
     * This function is used to clean up wiki paths before they are validated, it trims whitespace, removes unnecessary slashes, and removes "wiki/" from the start of the path.
     * @param wikiPath Unprocessed wiki path
     * @returns Processed wiki path
     */
    static preProcessWikiPath (wikiPath: string): string {
        wikiPath = wikiPath.trim().toLowerCase(); // Remove whitespace and convert to lowercase
        wikiPath = wikiPath.replace(/\/{2,}/g, "/"); // Remove multiple consecutive slashes

        // Remove leading and trailing slashes
        if (wikiPath.startsWith("/")) {
            wikiPath = wikiPath.substring(1);
        }
        if (wikiPath.endsWith("/")) {
            wikiPath = wikiPath.substring(0, wikiPath.length - 1);
        }

        // Remove leading "wiki/" if it exists
        if (wikiPath.startsWith("wiki/")) {
            // We're also removing multiple leading "wiki/" strings, we really don't want to allow top level pages to start with "wiki/" either.
            // A top level wiki page named "wiki" would be indistinguishable from the root of the wiki in an unprocessed user-entered path.
            wikiPath = wikiPath.replace(/^(wiki\/){1,}/, "");
        }
        return wikiPath;
    }

    /**
     * This function checks if a wiki path is valid. Consider using preProcessWikiPath before calling this function.
     * @param wikiPath Wiki path to check
     * @returns True if the wiki path is valid
     */
    static isValidWikiPath (wikiPath: string): boolean {
        // Must not start or end with a slash
        // Must not start with "wiki/"
        // Only lowercase letters, numbers, underscores, hyphens, and slashes are allowed
        return wikiPath.match(/^(?!wiki\/)[a-z0-9_-][a-z0-9_/-]+[a-z0-9_-]$/) !== null;
    }
}

/**
 * Returns a WikiPath object if the provided path is valid, otherwise returns undefined.
 * @param wikiPath Path to create a WikiPath object from
 * @returns WikiPath object or undefined
 */
export function getWikiPath (wikiPath: string): WikiPath | undefined {
    try {
        return new WikiPath(wikiPath);
    } catch {
        return undefined;
    }
}
