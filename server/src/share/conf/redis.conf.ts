import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule,
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
  exports: [RedisModule],
})
export class RedisConfigModule {}
