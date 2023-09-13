import {Body, Controller, InternalServerErrorException, Post, Res} from "@nestjs/common";
import {DownloadService} from "./download.service";
import {ApiConsumes, ApiProperty, ApiTags} from "@nestjs/swagger";
import {DownloadDto} from "./download.dto";
import {FetchInfoDto} from "../fetcher/fetcher.dto";
import {Response} from "express";
import {map} from "rxjs";
import * as fs from "fs";

@Controller({
    version :'1',
    path :'download'
})
@ApiTags("Download")
export class DownloadController {
    constructor(private readonly downloadService:DownloadService) {
    }
    @Post()
    @ApiProperty({type:DownloadDto, required:true})
    @ApiConsumes("application/x-www-form-urlencoded")
    downloadContent(@Body() {url,quality}: DownloadDto, @Res() response: Response){
        return this.downloadService.download(url, quality).pipe(map(s => {
            return s.subscribe(
                {
                    next({data, filePath, title}) {
                        data.on('end', () => {
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
                    error: (err) =>  {
                        throw new InternalServerErrorException()
                    },
                }
            )
        }));
    }
}