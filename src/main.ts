import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {appConf, swaggerConf} from './share/conf';
import {VersioningType} from "@nestjs/common";
import {HttpExceptionFilter} from "./share/http/filters";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({prefix:"api/v" ,type:VersioningType.URI,defaultVersion:'1'})
    app.useGlobalFilters(new HttpExceptionFilter());
    const configService: ConfigService = app.get<ConfigService>(ConfigService);
    swaggerConf(app);
    await appConf(app, configService);
}

bootstrap();
