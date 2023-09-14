import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {Readable} from "stream";
import {catchError, Observable, of, switchMap} from "rxjs";
import * as Ffmpeg from "fluent-ffmpeg";
import {DownloadedMusic} from "../../share/interfaces/download.interface";
import {SongQuality} from "../../share/interfaces/content.interface";
import {join} from "path";
import {createReadStream, createWriteStream, unlink, WriteStream} from "fs"
import * as archiver from "archiver";
import {generateUUID} from "../../share/utils/crypto";

@Injectable()
export class ConvertService {
  constructor() {}
  convertVideoToFlac$(stream: Readable, filePath: string, artistName: string) {
    try {
      return of(
        Ffmpeg(stream)
          .toFormat("flac")
          .outputOptions("-metadata", `artist=${artistName}`)
          .audioCodec("flac")
          .audioFrequency(96000) // or 44100 for CD quality
          .audioQuality(0) // 0 means highest quality in FLAC
          .audioChannels(2)
          .save(filePath)
      );
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }
  convertVideoToAac$(stream: Readable, filePath: string, artistName: string) {
    try {
      return of(
        Ffmpeg(stream)
          .toFormat("aac")
          .outputOptions("-metadata", `artist=${artistName}`)
          .audioCodec("aac")
          .audioFrequency(44100)
          .audioBitrate(256)
          .audioChannels(2)
          .save(filePath)
      );
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }
  convertVideoToMp3$(stream: Readable, filePath: string, artistName: string) {
    try {
      return of(
        Ffmpeg(stream)
          .toFormat("mp3")
          .outputOptions("-metadata", `artist=${artistName}`)
          .audioCodec("libmp3lame")
          .audioFrequency(44100)
          .audioChannels(2)
          .audioBitrate(128)
          .save(filePath)
      );
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }
  convertStreamToSong(
    quality: SongQuality,
    stream: Readable,
    filePath: string,
    channelName: string,
    title: string
  ): Observable<DownloadedMusic> {
    const command$ =
      quality === SongQuality.High
        ? this.convertVideoToFlac$(stream, filePath, channelName)
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
        throw new InternalServerErrorException(err);
      })
    );
  }

   zipDownloadedContent(
      downloadedContent: DownloadedMusic[] ,
      quality: SongQuality,
      album_name: string,
  ): Observable<string> {
    return new Observable<string>((subscriber) => {
      try {
        // Creates a zip archive for the downloaded content files
        const zipFilePath = join(
            __dirname,
            "..",
            "..",
            "..",
            "tmp",
            `${generateUUID()}.zip`
        );
        const output = createWriteStream(zipFilePath);
        const archive = archiver('zip', {zlib: {level: 9}});
        archive.pipe(output);
        this.appendDownloadedContentToZip(
            downloadedContent,
            archive,
            quality,
            output,
        )
        output.on('close', () => {
          subscriber.next(zipFilePath);
          subscriber.complete();
        });

        archive.on('warning', (err: any) => {
          subscriber.error(err);
        });

        archive.on('error', (err: any) => {
          subscriber.error(err);
        });

      } catch (err) {
        subscriber.error(err);
      }
    });
  }


  async  appendDownloadedContentToZip(
      downloadedContent:DownloadedMusic[],
      archive: archiver.Archiver,
      quality: SongQuality,
      output: WriteStream,
  ): Promise<void> {
    try {
      await Promise.all(
          downloadedContent.map((content) => {
            return new Promise((res, rej) => {
              if(content.data instanceof WriteStream){
                content.data.on(  'finish', () => {
                  archive.append(createReadStream(content.filePath), {
                    name: `${content.title}.mp4`,
                  });
                  res(null);
                });
              }else{
                const format = quality === SongQuality.High ? "flac" : "mp3"
                content.data.on(  'end', () => {
                  archive.append(createReadStream(content.filePath), {
                    name: `${content.title}.${format}`,
                  });
                  res(null);
                });
              }

              content.data.on('error', (error: any) => {
                rej(error);
              });
            });
          }),
      ).then(async () => {
        downloadedContent.map((content) =>
            unlink(content.filePath, (err: any) => {
              if (err) throw new Error(err);
            }),
        );
        await archive.finalize();
        output.close();
      });
    } catch (err: any) {
      throw err
    }
  }
}
