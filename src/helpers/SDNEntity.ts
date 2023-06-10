/**
 * Represents a SDN entity
 * @category Utilities
 */
export class SDNEntity {
    private entityLocalpart: string;
    private entityDomain: string;

    /**
     * Creates a new SDN entity
     * @param {string} fullId The full ID of the entity
     */
    constructor(private fullId: string) {
        if (!fullId) throw new Error("No entity ID provided");
        if (fullId.length < 2) throw new Error("ID too short");
        const parts = fullId.split(/:/g);
        this.entityLocalpart = parts[0].substring(1);
        this.entityDomain = parts.splice(1).join(':');
    }

    /**
     * The localpart for the entity
     */
    public get localpart(): string {
        return this.entityLocalpart;
    }

    /**
     * The domain for the entity
     */
    public get domain(): string {
        return this.entityDomain;
    }

    // override
    public toString(): string {
        return this.fullId;
    }
}

/**
 * Represents a SDN user ID
 * @category Utilities
 */
export class UserID extends SDNEntity {
    constructor(userId: string) {
        super(userId);
        if (!userId.startsWith("@")) {
            throw new Error("Not a valid user ID");
        }
    }
}

/**
 * Represents a SDN room alias
 * @category Utilities
 */
export class RoomAlias extends SDNEntity {
    constructor(alias: string) {
        super(alias);
        if (!alias.startsWith("#")) {
            throw new Error("Not a valid room alias");
        }
    }
}
