import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {Readable} from "stream"
import {catchError, Observable, of, switchMap} from "rxjs";
import * as Ffmpeg from "fluent-ffmpeg";
import {DownloadedMusic} from "../../share/interfaces/download.interface";
import {SongQuality} from "../../share/interfaces/content.interface";

@Injectable()
export class ConvertService {
    constructor() {
    }
    convertVideoToFlac$(stream: Readable, filePath: string, artistName: string) {
        try {
            return of(
                Ffmpeg(stream)
                    .toFormat('flac')
                    .outputOptions('-metadata', `artist=${artistName}`)
                    .audioCodec('flac')
                    .audioFrequency(96000) // or 44100 for CD quality
                    .audioQuality(0) // 0 means highest quality in FLAC
                    .audioChannels(2)
                    .save(filePath),
            );
        } catch (err: any) {
            throw new InternalServerErrorException(err)
        }
    }
    convertVideoToAac$(stream: Readable, filePath: string, artistName: string) {
        try {
            return of(
                Ffmpeg(stream)
                    .toFormat('aac')
                    .outputOptions('-metadata', `artist=${artistName}`)
                    .audioCodec('aac')
                    .audioFrequency(44100)
                    .audioBitrate(256)
                    .audioChannels(2)
                    .save(filePath),
            );
        } catch (err: any) {
            throw new InternalServerErrorException(err)
        }
    }
    convertVideoToMp3$(
        stream: Readable,
        filePath: string,
        artistName: string,
    ) {
        try {
            return of(
                Ffmpeg(stream)
                    .toFormat('mp3')
                    .outputOptions('-metadata', `artist=${artistName}`)
                    .audioCodec('libmp3lame')
                    .audioFrequency(44100)
                    .audioChannels(2)
                    .audioBitrate(128)
                    .save(filePath),
            );
        } catch (err: any) {
            throw new InternalServerErrorException(err)
        }
    }
    convertStreamToSong(
        quality: SongQuality,
        stream: Readable,
        filePath: string,
        channelName: string,
        title: string,
    ): Observable<DownloadedMusic> {
        const command$ = quality === SongQuality.High ?
            this.convertVideoToFlac$(stream, filePath, channelName)
            : SongQuality.Medium ?
             this.convertVideoToAac$(stream, filePath, channelName)
            : this.convertVideoToMp3$(stream, filePath, channelName);

        // Return converted stream data along with file path and title
        return command$.pipe(
            switchMap((data) => {
                return of({
                    data,
                    filePath,
                    title,
                });
            }),
            catchError((err) => {
                // Throw an HTTP error if something goes wrong
                throw new InternalServerErrorException(err)
            }),
        );
    }
}