import { SDNClient } from "./SDNClient";

/**
 * Functions for interacting with SDN prior to having an access token. Intended
 * to be used for logging in/registering to get a SDNClient instance.
 *
 * By design, this limits the options used to create the SDNClient. To specify
 * custom elements to the client, get the access token from the returned client
 * and create a new SDNClient instance. Due to the nature of SDN, it is
 * also recommended to use the nodeUrl from the generated SDNClient as
 * it may be different from that given to the SDNAuth class.
 */
export class SDNAuth {
    /**
     * Creates a new SDNAuth class for creating a SDNClient
     * @param {string} nodeUrl The node URL to authenticate against.
     */
    public constructor(private nodeUrl: string) {
        // nothing to do
    }

    /**
     * Generate a client with no access token so we can reuse the doRequest
     * logic already written.
     */
    private createTemplateClient(): SDNClient {
        return new SDNClient(this.nodeUrl, "");
    }

    public async didPreLogin(address: string): Promise<any> {
        const body = {}
        let response: any
        try {
            let tmpClient = this.createTemplateClient()
            let queryDidResp = await tmpClient.doRequest("GET", "/_api/client/unstable/address/" + address);
            if (queryDidResp["data"].length > 0) {
                body["did"] = queryDidResp["data"][0]
            } else {
                body["address"] = address
            }
            response = await tmpClient.doRequest("POST", "/_api/client/unstable/did/pre_login1", null, body);
        } catch (e) {
            throw e
        }
        if (!response) throw new Error("didPreLogin fail");
        return response
    }

    public async didLogin(address: string, did: string, message: string, token: string, nonce: string, update_time: string): Promise<any> {
        return await this.didLoginWithAppToken(address, did, message, token, "", nonce, update_time)
    }

    public async didLoginWithAppToken(address: string, did: string, message: string, token: string, appToken: string, nonce: string, update_time: string): Promise<any> {
        const body = {
            "identifier": {
                "did": did,
                "address": address,
                "message": message,
                "token": token,
                "app_token": appToken
            },
            "type": "m.login.did.identity",
            "random_server": nonce,
            "updated": update_time,
        }
        let response: any
        try {
            response = await this.createTemplateClient().doRequest("POST", "/_api/client/unstable/did/login", null, body);
        } catch (e) {
            throw e
        }
        if (!response) throw new Error("didLogin fail");
        return response
    }
}
