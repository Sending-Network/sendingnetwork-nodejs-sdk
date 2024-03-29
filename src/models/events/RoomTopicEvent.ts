import { StateEvent } from "./RoomEvent";

/**
 * The content definition for m.room.topic events
 * @category SDN event contents
 * @see RoomTopicEvent
 */
export interface RoomTopicEventContent {
    topic: string;
}

/**
 * Represents an m.room.topic state event
 * @category SDN events
 */
export class RoomTopicEvent extends StateEvent<RoomTopicEventContent> {
    constructor(event: any) {
        super(event);
    }

    /**
     * The topic of the room.
     */
    public get topic(): string {
        return this.content.topic;
    }
}
