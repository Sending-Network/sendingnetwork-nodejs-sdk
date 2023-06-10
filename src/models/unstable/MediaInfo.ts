/**
 * @category Unstable APIs
 */
export interface MSC2380MediaInfo {
    content_type: string;
    width?: number;
    height?: number;
    size: number;
    thumbnails?: {
        width: number;
        height: number;
        ready: boolean;
    }[];
    duration?: number;
}
