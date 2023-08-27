import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {appConf, swaggerConf} from './share/conf';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get<ConfigService>(ConfigService);
    swaggerConf(app);
    await appConf(app, configService);
}

bootstrap();
