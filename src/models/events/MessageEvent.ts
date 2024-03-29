import { RoomEvent } from "./RoomEvent";
import { EventRedactedError } from "./InvalidEventError";

/**
 * The types of messages that are valid in SDN.
 * @category SDN event info
 * @see MessageEventContent
 */
export type MessageType =
    "m.text"
    | "m.emote"
    | "m.notice"
    | "m.image"
    | "m.file"
    | "m.audio"
    | "m.location"
    | "m.video"
    | string;

/**
 * Information about a file in SDN
 * @category SDN event info
 * @see MessageEventContent
 */
export interface FileInfo {
    /**
     * The size of the file in bytes.
     */
    size?: number;

    /**
     * The type of file.
     */
    mimetype?: string;
}

/**
 * Information about a thumbnail in SDN
 * @category SDN event info
 * @see MessageEventContent
 */
export interface ThumbnailInfo {
    /**
     * The size of the thumbnail in bytes.
     */
    size?: number;

    /**
     * The type of thumbnail.
     */
    mimetype?: string;

    /**
     * The intended height of the thumbnail in pixels.
     */
    h: number;

    /**
     * The intended width of the thumbnail in pixels.
     */
    w: number;
}

/**
 * Information about a file's thumbnail.
 * @category SDN event info
 * @see MessageEventContent
 */
export interface ThumbnailedFileInfo {
    /**
     * A URL to a thumbnail for the file, if unencrypted.
     */
    thumbnail_url?: string;

    /**
     * The encrypted thumbnail file information, if encrypted.
     */
    thumbnail_file?: EncryptedFile;

    /**
     * Information about the thumbnail. Optionally included if a thumbnail_url is specified.
     */
    thumbnail_info?: ThumbnailInfo;
}

/**
 * Information about a file that has a thumbnail
 * @category SDN event info
 * @see MessageEventContent
 */
export interface FileWithThumbnailInfo extends FileInfo, ThumbnailedFileInfo {
}

/**
 * Information about a file that has a width and height.
 * @category SDN event info
 * @see MessageEventContent
 */
export interface DimensionalFileInfo extends FileWithThumbnailInfo {
    /**
     * The intended height of the media in pixels.
     */
    h: number;

    /**
     * The intended width of the media in pixels.
     */
    w: number;
}

/**
 * Information about a file that has a time dimension.
 * @category SDN event info
 * @see MessageEventContent
 */
export interface TimedFileInfo extends FileInfo {
    /**
     * The duration of the media in milliseconds.
     */
    duration: number;
}

/**
 * Information about a video file.
 * @category SDN event info
 * @see MessageEventContent
 */
export interface VideoFileInfo extends DimensionalFileInfo, TimedFileInfo {
    // No new properties.
}

/**
 * The content definition for m.room.message events with a type of m.audio
 * @category SDN event contents
 * @see MessageEvent
 */
export interface AudioMessageEventContent extends FileMessageEventContent {
    /**
     * Information about the file.
     */
    info?: TimedFileInfo;
}

/**
 * The content definition for m.room.message events with a type of m.video
 * @category SDN event contents
 * @see MessageEvent
 */
export interface VideoMessageEventContent extends FileMessageEventContent {
    /**
     * Information about the file.
     */
    info?: VideoFileInfo;
}

/**
 * The content definition for m.room.message events with a type of m.image
 * @category SDN event contents
 * @see MessageEvent
 */
export interface ImageMessageEventContent extends FileMessageEventContent {
    /**
     * Information about the file.
     */
    info?: DimensionalFileInfo;
}

/**
 * The content definition for m.room.message events with a type of m.file
 * @category SDN event contents
 * @see MessageEvent
 */
export interface FileMessageEventContent extends MessageEventContent {
    /**
     * Information about the file.
     */
    info?: FileWithThumbnailInfo;

    /**
     * URL to the file, if unencrypted.
     */
    url: string;

    /**
     * The encrypted file, if encrypted.
     */
    file: EncryptedFile;
}

/**
 * An encrypted file.
 * @category SDN event contents
 * @see MessageEvent
 */
export interface EncryptedFile {
    url: string;
    key: {
        kty: "oct";
        key_ops: string[];
        alg: "A256CTR";
        k: string;
        ext: true;
    };
    iv: string;
    hashes: {
        sha256: string;
    };
    v: "v2";
}

/**
 * The content definition for m.room.message events with a type of m.location
 * @category SDN event contents
 * @see MessageEvent
 */
export interface LocationMessageEventContent extends MessageEventContent {
    /**
     * Information about the location.
     */
    info?: ThumbnailedFileInfo;

    /**
     * A geo URI of the location.
     */
    geo_uri?: string;
}

/**
 * The content definition for m.room.message events with types of m.text, m.emote, and m.notice
 * @category SDN event contents
 * @see MessageEvent
 */
export interface TextualMessageEventContent extends MessageEventContent {
    format?: string;
    formatted_body?: string;
}

/**
 * The content definition for m.room.message events
 * @category SDN event contents
 * @see MessageEvent
 */
export interface MessageEventContent {
    body: string;
    msgtype: MessageType;
    external_url?: string;
}

/**
 * Represents an m.room.message room event
 * @category SDN events
 */
export class MessageEvent<T extends MessageEventContent> extends RoomEvent<T> {
    constructor(event: any) {
        super(event);
    }

    /**
     * Whether or not the event is redacted (or looked redacted).
     */
    public get isRedacted(): boolean {
        // Presume the event redacted if we're missing a body or message type
        const noContent = !this.content.body && this.content.body !== "";
        const noMsgtype = !this.content.msgtype && this.content.msgtype !== "";
        return noContent || noMsgtype;
    }

    /**
     * The message's type.
     */
    public get messageType(): MessageType {
        const type = this.content.msgtype;
        if (!type && type !== "") throw new EventRedactedError("missing msgtype");
        return type;
    }

    /**
     * The `body` of the message.
     */
    public get textBody(): string {
        const body = this.content.body;
        if (!body && body !== "") throw new EventRedactedError("missing body");
        return body;
    }

    /**
     * The `external_url` of the message, if it exists
     */
    public get externalUrl(): string | undefined {
        return this.content.external_url || undefined;
    }
}
