import {Module} from '@nestjs/common';
import {ConfigModuleConf, EventEmmiterConf, JwtConf, MongooseConf, ThrottlerConf} from './share/conf';
import {AuthModule} from './modules/auth/auth.module';
import {BullConf} from "./share/conf/bull.conf";
import {RedisConfigService} from "./share/conf/redis.conf";
import {RedisModule} from "@liaoliaots/nestjs-redis";

@Module({
    imports: [
        JwtConf,
        ThrottlerConf,
        MongooseConf,
        EventEmmiterConf,
        ConfigModuleConf,
        RedisModule.forRootAsync({
            useClass: RedisConfigService
        }),
        BullConf,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
