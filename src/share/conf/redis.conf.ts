import { RedisModule } from "@liaoliaots/nestjs-redis";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const RedisModuleConf = RedisModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    config: {
      url: config.getOrThrow("REDIS_URL"),
    },
    readyLog: true,
    closeClient: true,
  }),
});
