import {Process, Processor} from "@nestjs/bull";
import {FetcherQueueName} from "../../share/constants/queueus";

@Processor(FetcherQueueName)
export class FetcherQueue {
}