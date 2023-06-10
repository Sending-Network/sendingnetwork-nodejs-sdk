/**
 * Thrown when an event is invalid.
 * @category SDN events
 */
export class InvalidEventError extends Error {
    constructor(message: string = null) {
        super(message);
    }
}

/**
 * Thrown when an event is redacted.
 * @category SDN events
 */
export class EventRedactedError extends InvalidEventError {
    constructor(message: string = null) {
        super(message);
    }
}
