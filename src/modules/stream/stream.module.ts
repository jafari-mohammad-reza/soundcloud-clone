import {Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {StreamService} from "./stream.service";
import {HttpModule} from "@nestjs/axios";
import {StreamQueueName} from "../../share/constants/queueus";
import {ConvertModule} from "../convert/convert.module";
import {ConvertService} from "../convert/convert.service";

@Module({
    imports :[
        BullModule.registerQueue({
            name: StreamQueueName,
        }),
        HttpModule,
    ],
    providers:[StreamService , ConvertService]
})
export class StreamModule {

}