export interface ContentInterface {
    title: string;
    album: string;
    artist: string;

}

export enum  ContentUrlType {
    Video,
    PlayList
}

export enum SongQuality {
    Medium="Medium",
    High="High",
    Low="Low"
}