import {Processor} from "@nestjs/bull";
import {DownloadQueueName} from "../../share/constants/queueus";

@Processor(DownloadQueueName)
export class DownloadQueue {
    
}
