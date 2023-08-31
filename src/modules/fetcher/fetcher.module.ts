import {Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {FetcherQueueName} from "../../share/constants/queueus";
import {FetcherService} from "./fetcher.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports :[
        BullModule.registerQueue({
            name: FetcherQueueName,
        }),
        HttpModule
    ],
    providers:[FetcherService]
})
export class FetcherModule {

}