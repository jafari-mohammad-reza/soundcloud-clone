import {Module} from "@nestjs/common";
import {FetcherService} from "./fetcher.service";
import {FetcherController} from "./fetcher.controller";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports :[HttpModule],
    providers: [FetcherService],
    controllers : [FetcherController]
})
export class FetcherModule {}