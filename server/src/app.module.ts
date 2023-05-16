import { Module } from '@nestjs/common';
import {JwtConf,ThrottlerConf,CachingConf,MongooseConf,EventEmmiterConf,ConfigModuleConf} from "./share/conf"
@Module({
  imports: [JwtConf,ThrottlerConf,CachingConf,MongooseConf,EventEmmiterConf,ConfigModuleConf],
  controllers: [],
  providers: [],
})
export class AppModule {}
