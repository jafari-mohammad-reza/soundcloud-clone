import {Controller} from "@nestjs/common";
import {DownloadService} from "./download.service";

@Controller({
    version :'1',
    path :'download'
})
export class DownloadController {
    constructor(private readonly downloadService:DownloadService) {
    }
}