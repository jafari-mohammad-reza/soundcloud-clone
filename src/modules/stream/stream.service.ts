import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {HttpService} from "@nestjs/axios";
import {StreamQueueName} from "../../share/constants/queueus";
import {ContentUrlType} from "../../share/interfaces/content.interface";

@Injectable()
export class StreamService {
    constructor(
        @InjectQueue(StreamQueueName) private readonly fetcherQueue:Queue,
        private readonly httpService:HttpService
    ) {
    }

}