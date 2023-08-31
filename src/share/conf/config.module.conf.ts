import {ConfigModule} from '@nestjs/config';
import * as joi from 'joi';

export const ConfigModuleConf = ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: joi.object({
        NODE_ENV: joi.string().required(),
        MONGODB_URL: joi.string().required(),
        REDIS_URL: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        REDIS_PORT: joi.string().required()
    }),
    validationOptions: {
        allowUnknown: true,
        abortEarly: true,
    },
    cache: true,
});
