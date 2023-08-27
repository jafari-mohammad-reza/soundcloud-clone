import {BullModule} from "@nestjs/bull";
import {ConfigModule, ConfigService} from "@nestjs/config";

export const BullConf = BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        redis: {
            host: config.getOrThrow("REDIS_HOST"),
            port: config.getOrThrow("REDIS_PORT"),
            keyPrefix: "queue",
        },
        limiter: {
            max: 100,
            duration: 15000, //  15 seconds.
        },
        defaultJobOptions: {
            backoff: 5,
            removeOnComplete: true,
            removeOnFail: 6,
            timeout: 15000,
            attempts: 6,
        },
    })
})