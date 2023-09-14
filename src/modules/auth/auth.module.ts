import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel, UserSchema } from "src/share/database";
import { JwtModuleService } from "src/share/services/jwt.service";
import { EmailService } from "src/share/services/email.service";
import { JwtConf, MailerConf } from "src/share/conf";
import { AuthQueue } from "./auth.queue";
import { BullModule } from "@nestjs/bull";
import { AuthQueueName } from "../../share/constants/queueus";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MailerConf,
    JwtConf,
    BullModule.registerQueue({
      name: AuthQueueName,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModuleService, EmailService, AuthQueue],
})
export class AuthModule {}
