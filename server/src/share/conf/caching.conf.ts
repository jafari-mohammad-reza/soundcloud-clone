import {CacheModule} from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';
import {CacheStore} from "@nestjs/common";
import {RedisClientOptions} from "redis";
import {ConfigModule, ConfigService} from "@nestjs/config";
export const CachingConf = CacheModule.registerAsync<RedisClientOptions>({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory : (configService:ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        isGlobal:true,
        ttl:300,
        url:configService.getOrThrow("REDIS_URL")
    })
});
