import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModel, UserSchema} from 'src/share/database';
import {JwtModuleService} from 'src/share/services/jwt.service';
import {EmailService} from 'src/share/services/email.service';
import {MailerConf} from '../../share/conf/mailer.conf';
import {JwtConf} from "src/share/conf"
@Module({
    imports: [
        MongooseModule.forFeature([{name: UserModel.name, schema: UserSchema}]),
        JwtConf,
        MailerConf,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtModuleService, EmailService],
})
export class AuthModule {
}
