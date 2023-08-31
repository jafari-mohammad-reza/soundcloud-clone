import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {FetcherQueueName} from "../../share/constants/queueus";
import {Queue} from "bull";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class FetcherService {
    constructor(
        @InjectQueue(FetcherQueueName) private readonly fetcherQueue:Queue,
        private readonly httpService:HttpService
    ) {
    }
    async fetchUrlBytes(){
        
    }
}