import {ThrottlerModule} from "@nestjs/throttler";
import {redisStore} from "cache-manager-redis-store";

export const ThrottlerConf = ThrottlerModule.forRoot({
    ttl: 120,
    limit: 40,
    storage: redisStore({url: process.env.REDIS_URL, ttl: 120})
})
