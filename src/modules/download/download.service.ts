import {BadRequestException, Injectable} from "@nestjs/common";
import {SongQuality} from "../../share/interfaces/content.interface";
import {Readable} from "stream";
import {Observable} from "rxjs";
import {DownloadedMusic} from "../../share/interfaces/download.interface";

@Injectable()
export class DownloadService {
    constructor() {
    }
    download(url:string,quality:SongQuality): Observable<DownloadedMusic> {
        const contentTypeKey = url.split("https://www.youtube.com/"[1]).toString().split("?")[0].toString()
        if(contentTypeKey === "playlist"){
            return this.downloadPlaylist(url,quality)
        }else if(contentTypeKey === "watch"){
            return this.downloadSong(url,quality)
        }else {
            throw new BadRequestException('Invalid content type')
        }
    }
    private downloadSong(url : string,quality:SongQuality): Observable<DownloadedMusic>{
        return new Observable<DownloadedMusic>(subscriber => {})
    }
    private downloadPlaylist(url : string,quality:SongQuality): Observable<DownloadedMusic>{
        return new Observable<DownloadedMusic>(subscriber => {})
    }
    private downloadChunk(url:string){}
}