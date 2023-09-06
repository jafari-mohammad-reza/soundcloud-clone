import {Module} from '@nestjs/common';
import {BullConf, ConfigModuleConf, EventEmmiterConf, JwtConf, MongooseConf, ThrottlerConf} from './share/conf';
import {AuthModule} from './modules/auth/auth.module';
import {RedisModule} from "@liaoliaots/nestjs-redis";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {FetcherModule} from "./modules/fetcher/fetcher.module";
import {StreamModule} from "./modules/stream/stream.module";
import {DownloadModule} from "./modules/download/download.module";

@Module({
    imports: [
        JwtConf,
        ThrottlerConf,
        MongooseConf,
        EventEmmiterConf,
        ConfigModuleConf,
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                config: {
                    url: config.getOrThrow('REDIS_URL'),
                },
                readyLog: true,
                closeClient: true,
            }),
        }),
        BullConf,
        AuthModule,
        FetcherModule,
        StreamModule,
        DownloadModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
