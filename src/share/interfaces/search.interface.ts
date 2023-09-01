export enum YoutubeContentType {
    Video,
    Playlist
}
export interface SearchResultInterface {
    link :string;
    name: string;
    cover: string;
    duration?: string;
    channel: string;
    contentType : YoutubeContentType
}