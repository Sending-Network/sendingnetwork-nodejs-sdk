import { StateEvent } from "./RoomEvent";

/**
 * The content definition for m.room.name events
 * @category SDN event contents
 * @see RoomNameEvent
 */
export interface RoomNameEventContent {
    name: string;
}

/**
 * Represents an m.room.name state event
 * @category SDN events
 */
export class RoomNameEvent extends StateEvent<RoomNameEventContent> {
    constructor(event: any) {
        super(event);
    }

    /**
     * The name of the room.
     */
    public get name(): string {
        return this.content.name;
    }
}
