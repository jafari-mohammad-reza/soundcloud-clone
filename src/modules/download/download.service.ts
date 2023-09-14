import { BadRequestException, Injectable } from "@nestjs/common";
import { SongQuality } from "../../share/interfaces/content.interface";
import {
  catchError, concatMap,
  delay,
  forkJoin,
  from,
  map,
  mergeAll,
  mergeMap,
  Observable,
  retryWhen,
  switchMap,
  toArray
} from "rxjs";
import { DownloadedMusic } from "../../share/interfaces/download.interface";
import { FetcherService } from "../fetcher/fetcher.service";
import { join } from "path";
import { generateUUID } from "../../share/utils/crypto";
import { ConvertService } from "../convert/convert.service";

@Injectable()
export class DownloadService {
  constructor(
    private readonly fetcherService: FetcherService,
    private readonly convertService: ConvertService
  ) {}
  download(
    url: string,
    quality: SongQuality
  ): Observable<Observable<DownloadedMusic>> | Observable<string> {
    let path;
    if (url.includes("www.")) {
      path = url.split("https://www.youtube.com/")[1];
    } else {
      path = url.split("https://youtube.com/")[1];
    }
      console.log(path)
    // get the first part from the path before '?'
    const contentTypeKey = path.split("?")[0];
      console.log(contentTypeKey)
    if (contentTypeKey.startsWith("playlist")) {
      return this.downloadPlaylist(url, quality);
    } else if (contentTypeKey.startsWith("watch")) {
      return this.downloadSong(url, quality);
    } else {
      throw new BadRequestException("Invalid content type");
    }
  }
  private downloadSong(
    url: string,
    quality: SongQuality
  ): Observable<Observable<DownloadedMusic>> {
    return this.fetcherService.getVideoBytes(url).pipe(
      map(({ stream, info }) => {
        const format =
          quality === SongQuality.High
            ? "flac"
            : SongQuality.Medium
            ? "wav"
            : "mp3";
        const filePath = join(
          __dirname,
          "..",
          "..",
          "..",
          "tmp",
          `${generateUUID()}.${format}`
        );
        const title = info.videoDetails.title;
        const channelName = info.videoDetails.ownerChannelName;
        return this.convertService.convertStreamToSong(
          quality,
          stream,
          filePath,
          channelName,
          title
        );
      })
    );
  }
  private downloadPlaylist(url: string, quality: SongQuality): Observable<string> {
      let id;
      if (url.includes("www.")) {
          id = url.split("https://www.youtube.com/playlist?list=")[1];
      } else {
          id = url.split("https://youtube.com/playlist?list=")[1];
      }
    if (!id) {
      throw new BadRequestException('id not exist');
    }
    return this.fetcherService.getPlaylistItemsUrls(id).pipe(
        concatMap(({urls , title}) =>
            from(urls).pipe(
                mergeMap((url) => this.downloadSong(url, quality)),
                toArray(),
                mergeMap((downloadedSongsObservables: Observable<DownloadedMusic>[]) =>
                    forkJoin(downloadedSongsObservables).pipe(
                        mergeMap((downloadedSongs: DownloadedMusic[]) => {
                            console.log(title)
                            return this.convertService.zipDownloadedContent(downloadedSongs, quality, title)
                            }

                        )
                    )
                ),
            )
        ),
        retryWhen(errors => errors.pipe(delay(1000)))
    );
  }
}
