import { Module } from '@nestjs/common';
import {
  ConfigModuleConf,
  EventEmmiterConf,
  JwtConf,
  MongooseConf,
  RedisConfigModule,
  ThrottlerConf,
} from './share/conf';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtConf,
    ThrottlerConf,
    MongooseConf,
    EventEmmiterConf,
    ConfigModuleConf,
    AuthModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          url: config.getOrThrow('REDIS_URL'),
        },
        readyLog: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
