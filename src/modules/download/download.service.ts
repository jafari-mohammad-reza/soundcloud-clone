import {BadRequestException, Injectable} from "@nestjs/common";
import {SongQuality} from "../../share/interfaces/content.interface";
import {map, Observable} from "rxjs";
import {DownloadedMusic} from "../../share/interfaces/download.interface";
import {FetcherService} from "../fetcher/fetcher.service";
import {join} from "path";
import {generateUUID} from "../../share/utils/crypto";
import {ConvertService} from "../convert/convert.service";

@Injectable()
export class DownloadService {
    constructor(
        private readonly fetcherService:FetcherService,
        private readonly convertService:ConvertService
    ) {
    }
    download(url:string,quality:SongQuality): Observable<Observable<DownloadedMusic>> {
        const path = url.split("https://www.youtube.com/")[1];
        // get the first part from the path before '?'
        const contentTypeKey = path.split("?")[0]
        if(contentTypeKey.startsWith('playlist')){
            return this.downloadPlaylist(url,quality)
        }else if(contentTypeKey.startsWith('watch')){
            return this.downloadSong(url,quality)
        }else {
            throw new BadRequestException('Invalid content type')
        }
    }
    private downloadSong(url : string,quality:SongQuality): Observable<Observable<DownloadedMusic>>{
        return this.fetcherService.getVideoBytes(url).pipe(map(({stream , info}) => {
            const format = quality === SongQuality.High ? "flac" : SongQuality.Medium ? "wav" : "mp3"
            const filePath =  join(__dirname , ".." , ".." , ".." , "tmp" , `${generateUUID()}.${format}`)
            const title = info.videoDetails.title;
            const channelName = info.videoDetails.ownerChannelName;
            return this.convertService.convertStreamToSong(       quality ,
                stream,
                filePath,
                channelName,
                title,)
        }))
    }
    private downloadPlaylist(url : string,quality:SongQuality):  any {
        return new Observable<DownloadedMusic>(subscriber => {})
    }
}