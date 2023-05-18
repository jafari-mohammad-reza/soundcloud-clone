import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { join } from 'path';

export const ConfigModuleConf = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: join(__dirname, '..', '..', '..', '.env.development'),
  validationSchema: joi.object({
    NODE_ENV: joi.string().required(),
    MONGODB_URL: joi.string().required(),
    REDIS_URL: joi.string().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  cache: true,
});
