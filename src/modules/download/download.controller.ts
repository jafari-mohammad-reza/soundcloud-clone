import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
} from "@nestjs/common";
import { DownloadService } from "./download.service";
import { ApiConsumes, ApiProperty, ApiTags } from "@nestjs/swagger";
import { DownloadDto } from "./download.dto";
import { FetchInfoDto } from "../fetcher/fetcher.dto";
import { Response } from "express";
import { isObservable, map, mergeAll, Observable, of } from "rxjs";
import * as fs from "fs";
import { DownloadedMusic } from "../../share/interfaces/download.interface";

@Controller({
  version: "1",
  path: "download",
})
@ApiTags("Download")
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
  @Post()
  @ApiProperty({ type: DownloadDto, required: true })
  @ApiConsumes("application/x-www-form-urlencoded")
  downloadContent(
    @Body() { url, quality }: DownloadDto,
    @Res() response: Response
  ) {
    const downloadResult = this.downloadService.download(url, quality);
    // @ts-ignore
    downloadResult.subscribe((result) => {
      if (typeof result === "string") {
        this.downloadAlbum(of(result), response);
      } else if (result instanceof Observable) {
        this.downloadSong(result, response);
      }
    });
  }
  private downloadSong(
    result: Observable<DownloadedMusic>,
    response: Response
  ) {
    return result.subscribe({
      next({ data, filePath, title }) {
        data.on("end", () => {
          response.download(filePath, title, (err) => {
            if (err) {
              console.error(err);
            }
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          });
        });
      },
      error: (err) => {
        throw new InternalServerErrorException();
      },
    });
  }
  private downloadAlbum(result: Observable<string>, response: Response) {
    return result.subscribe({
      next(path) {
        console.log(path);
        console.log(path.split(".zip")[0].split("_")[0]);
        response.download(path, path.split(".zip")[0].split("_")[0], (err) => {
          if (err) {
            console.error(err);
          }
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      },
      error: (err) => {
        throw new InternalServerErrorException();
      },
    });
  }
}
