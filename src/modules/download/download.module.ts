import {Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {DownloadQueueName} from "../../share/constants/queueus";

@Module({
    imports : [
        BullModule.registerQueue({
            name : DownloadQueueName,
            limiter  :{
                max:100,
                bounceBack:true,
                duration:25000,
            }
        })
    ],
    providers : [],
    controllers :[]
})
export class DownloadModule{}