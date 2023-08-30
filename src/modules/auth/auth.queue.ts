import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {generateUUID} from "../../share/utils/crypto";
import {EmailService} from "../../share/services/email.service";
import {Inject} from "@nestjs/common";
import {DEFAULT_REDIS_NAMESPACE, InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {AuthQueueName} from "../../share/constants/queueus";
import {InjectModel} from "@nestjs/mongoose";
import {UserModel} from "../../share/database";
import {Model} from "mongoose";
import {ConfigService} from "@nestjs/config";

@Processor(AuthQueueName)
export class AuthQueue {
    constructor(
        private readonly emailService: EmailService,
        @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
        private readonly configService:ConfigService
    ) {
    }
    @Process('sendVerificationEmail')
    async sendVerificationEmail(job:Job<{email:string}>){
        const {email} = job.data
        const token = generateUUID();
        await this.redis.set(token, email , "EX" , 10000); // 10 minutes ttl
        await this.emailService.sendEmail(
            email,
            'Verify your account.',
            `
            <a href="${this.configService.getOrThrow("CLIENT_URL")}/auth/verify/${token}">Verify account</a>
         `,
        );
    }
    @Process("loginEvent")
    async loginEvent(job :Job<{email:string , ip:string}>){
        const {ip,email} = job.data
        await this.userModel.updateOne(
            {email},
            {$set: {lastLogin: new Date()}},
        );
        await this.emailService.sendEmail(
            email,
            'Verify your account.',
            `new device logged in your account with ip of ${ip}`,
        );
    }
}