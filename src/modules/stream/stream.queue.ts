import {Process, Processor} from "@nestjs/bull";
import {StreamQueueName} from "../../share/constants/queueus";

@Processor(StreamQueueName)
export class StreamQueue {
}