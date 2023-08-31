import {Injectable} from "@nestjs/common";
import {DEFAULT_REDIS_NAMESPACE, InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {HttpService} from "@nestjs/axios";
import {SearchResultInterface} from "../../share/interfaces";
import {SearchDto} from "./search.dto";

@Injectable()
export class SearchService {
    constructor(
        @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis:Redis,
        private readonly httpService:HttpService
    ) {
    }
    async searchKeyWord({keyWord , limit}:SearchDto) : Promise<SearchResultInterface> {
        return null
    }
}