import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as morgan from 'morgan';

export async function appConf(
  app: INestApplication,
  configService: ConfigService,
) {
  app.enableCors({ origin: true, credentials: true });
  app.enableVersioning({
    prefix: 'api/v',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(helmet());
  app.use(
    morgan(
      configService.getOrThrow('NODE_ENV') === 'development' ? 'dev' : 'common',
    ),
  );
  await app.listen(5000);
  app.enableShutdownHooks();
}
