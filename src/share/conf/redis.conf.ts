import { Injectable } from '@nestjs/common';
import { RedisModuleOptions, RedisOptionsFactory } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions(): RedisModuleOptions {
        return {
            readyLog: true,
            config: {
                url: process.env.REDIS_URL
            }
        };
    }
}