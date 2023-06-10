import { SDNClient } from "../SDNClient";

/**
 * Flags a SDNClient function as needing end-to-end encryption enabled.
 * @category Encryption
 */
export function requiresCrypto() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const client: SDNClient = this; // eslint-disable-line @typescript-eslint/no-this-alias
            if (!client.crypto) {
                throw new Error("End-to-end encryption is not enabled");
            }

            return originalMethod.apply(this, args);
        };
    };
}
