/**
 * An OpenID Connect token from the node.
 * @category Models
 */
export interface OpenIDConnectToken {
    access_token: string;
    expires_in: number;
    sdn_server_name: string;
    token_type: 'Bearer';
}
