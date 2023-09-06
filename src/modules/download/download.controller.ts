import {Body, Controller, Post, Res} from "@nestjs/common";
import {DownloadService} from "./download.service";
import {ApiConsumes, ApiProperty} from "@nestjs/swagger";
import {DownloadDto} from "./download.dto";
import {FetchInfoDto} from "../fetcher/fetcher.dto";
import {Response} from "express";

@Controller({
    version :'1',
    path :'download'
})
export class DownloadController {
    constructor(private readonly downloadService:DownloadService) {
    }
    @Post()
    @ApiProperty({type:DownloadDto, required:true})
    @ApiConsumes("application/x-www-form-urlencoded")
    downloadContent(@Body() {url,quality}: DownloadDto, @Res() response: Response){
        this.downloadService.download(url,quality)
    }
}