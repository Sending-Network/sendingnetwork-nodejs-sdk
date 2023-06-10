import {
    METRIC_IDENTITY_CLIENT_FAILED_FUNCTION_CALL,
    METRIC_IDENTITY_CLIENT_FUNCTION_CALL,
    METRIC_IDENTITY_CLIENT_SUCCESSFUL_FUNCTION_CALL,
    METRIC_INTENT_FAILED_FUNCTION_CALL,
    METRIC_INTENT_FUNCTION_CALL,
    METRIC_INTENT_SUCCESSFUL_FUNCTION_CALL,
    METRIC_SDN_CLIENT_FAILED_FUNCTION_CALL,
    METRIC_SDN_CLIENT_FUNCTION_CALL,
    METRIC_SDN_CLIENT_SUCCESSFUL_FUNCTION_CALL,
} from "./names";
import { IdentityClientCallContext, IntentCallContext, SDNClientCallContext } from "./contexts";

/**
 * Times a SDNClient function call for metrics.
 * @category Metrics
 */
export function timedSDNClientFunctionCall() {
    return function(_target: unknown, functionName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args) {
            const context = this.metrics.assignUniqueContextId(<SDNClientCallContext>{
                functionName,
                client: this,
            });
            this.metrics.start(METRIC_SDN_CLIENT_FUNCTION_CALL, context);
            try {
                const result = await originalMethod.apply(this, args);
                this.metrics.increment(METRIC_SDN_CLIENT_SUCCESSFUL_FUNCTION_CALL, context, 1);
                return result;
            } catch (e) {
                this.metrics.increment(METRIC_SDN_CLIENT_FAILED_FUNCTION_CALL, context, 1);
                throw e;
            } finally {
                this.metrics.end(METRIC_SDN_CLIENT_FUNCTION_CALL, context);
            }
        };
    };
}

/**
 * Times an IdentityClient function call for metrics.
 * @category Metrics
 */
export function timedIdentityClientFunctionCall() {
    return function(_target: unknown, functionName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            const context = this.metrics.assignUniqueContextId(<IdentityClientCallContext>{
                functionName,
                client: this,
            });
            this.metrics.start(METRIC_IDENTITY_CLIENT_FUNCTION_CALL, context);
            try {
                const result = await originalMethod.apply(this, args);
                this.metrics.increment(METRIC_IDENTITY_CLIENT_SUCCESSFUL_FUNCTION_CALL, context, 1);
                return result;
            } catch (e) {
                this.metrics.increment(METRIC_IDENTITY_CLIENT_FAILED_FUNCTION_CALL, context, 1);
                throw e;
            } finally {
                this.metrics.end(METRIC_IDENTITY_CLIENT_FUNCTION_CALL, context);
            }
        };
    };
}

/**
 * Times an Intent function call for metrics.
 * @category Metrics
 */
export function timedIntentFunctionCall() {
    return function(_target: unknown, functionName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            const context = this.metrics.assignUniqueContextId(<IntentCallContext>{
                functionName,
                client: this.client,
                intent: this,
            });
            this.metrics.start(METRIC_INTENT_FUNCTION_CALL, context);
            try {
                const result = await originalMethod.apply(this, args);
                this.metrics.increment(METRIC_INTENT_SUCCESSFUL_FUNCTION_CALL, context, 1);
                return result;
            } catch (e) {
                this.metrics.increment(METRIC_INTENT_FAILED_FUNCTION_CALL, context, 1);
                throw e;
            } finally {
                this.metrics.end(METRIC_INTENT_FUNCTION_CALL, context);
            }
        };
    };
}
