import { Module } from '@nestjs/common';
import {JwtConf,ThrottlerConf,CachingConf,MongooseConf,EventEmmiterConf,ConfigModuleConf} from "./share/conf"
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [JwtConf,ThrottlerConf,CachingConf,MongooseConf,EventEmmiterConf,ConfigModuleConf, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
