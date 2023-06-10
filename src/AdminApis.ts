import { SDNClient } from "./SDNClient";

/**
 * Whois information about a user.
 * @category Admin APIs
 */
export interface WhoisInfo {
    user_id: string;
    devices: {
        [device_id: string]: {
            sessions: [{
                connections: WhoisConnectionInfo[];
            }];
        };
    };
}

interface WhoisConnectionInfo {
    /**
     * Most recently seen IP address of the session.
     */
    ip: string;

    /**
     * Unix timestamp that the session was last active.
     */
    last_seen: number;

    /**
     * User agent string last seen in the session.
     */
    user_agent: string;
}

/**
 * Access to various administrative APIs.
 * @category Admin APIs
 */
export class AdminApis {
    constructor(private client: SDNClient) {
    }

    /**
     * Gets information about a particular user.
     * @param {string} userId the user ID to lookup
     * @returns {Promise<WhoisInfo>} resolves to the whois information
     */
    public whoisUser(userId: string): Promise<WhoisInfo> {
        return this.client.doRequest("GET", "/_api/client/v3/admin/whois/" + encodeURIComponent(userId));
    }
}
