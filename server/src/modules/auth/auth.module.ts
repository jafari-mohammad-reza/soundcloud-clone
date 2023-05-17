import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/share/database';
import { JwtConf } from 'src/share/conf';
import { JwtModuleService } from 'src/share/services/jwt.service';
import { AxiosModuleConf } from 'src/share/conf/axios.module.conf';
import { EmailService } from 'src/share/services/email.service';

@Module({
  imports : [MongooseModule.forFeature([{name:UserModel.name ,schema:UserSchema}]) , JwtConf ],
  controllers: [AuthController],
  providers: [AuthService ,JwtModuleService,EmailService]
})
export class AuthModule {}
