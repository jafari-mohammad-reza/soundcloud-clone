import {Model} from 'mongoose';
import {BadRequestException, ForbiddenException, Inject, Injectable,} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {UserDocument, UserModel} from 'src/share/database';
import {JwtModuleService} from 'src/share/services/jwt.service';
import {LoginDto, RegisterDto} from './auth.dto';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InvalidCredentialsException} from 'src/share/http/exceptions/InvalidCredentials.exception';
import {verifyPassword} from 'src/share/utils';
import {UserAccountStatus} from 'src/share/database/schemas/user.schema';
import {EmailService} from 'src/share/services/email.service';
import {generateUUID} from '../../share/utils/crypto';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
        @Inject(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
        private readonly jwtService: JwtModuleService,
        private readonly eventEmitter: EventEmitter2,
        private readonly emailService: EmailService,
    ) {
    }

    async registerUser(registerDto: RegisterDto, ip: string) {
        const {email, username, password} = registerDto;
        if ((await this.isUserExist(email, username)).length > 0) {
            throw new InvalidCredentialsException();
        }
        this.eventEmitter.emit('user.register', {email});
        return await this.userModel.create({
            email,
            username,
            password,
            registerIp: ip.split('::ffff:')[1],
        });
    }

    async loginUser(loginDto: LoginDto, ip: string) {
        const {email, password} = loginDto;
        const user = await this.userModel.findOne({email});

        if (!user || !verifyPassword(password, user.password)) {
            throw new InvalidCredentialsException();
        }
        if (user.accountStatus !== UserAccountStatus.Active) {
            throw new ForbiddenException();
        }
        if (!(await this.validateLoginActivity(user, ip))) {
            throw new ForbiddenException();
        }
        this.eventEmitter.emit('user.login', {email, ip});
        return await this.jwtService.signToken(user._id.toString());
    }

    async activeUserAccount(token: string) {
        const email = await this.redis.get(token);
        if (!email) throw new BadRequestException();
        return await this.userModel.findOneAndUpdate(
            {email},
            {$set: {accountStatus: UserAccountStatus.Active}},
        );
    }

    async sendVerificationEmail(email: string) {
        const token = generateUUID();
        await this.redis.set(token, email , "EX" , 10000); // 10 minutes ttl
        await this.emailService.sendEmail(
            email,
            'Verify your account.',
            `
            <a href="${process.env.CLIENT_URL}/auth/verify/${token}">Verify account</a>
         `,
        );
    }

    async loginEvent(email: string, ip: string) {
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

    async validateLoginActivity(user: UserDocument, ip: string) {
        return user.registerIp !== ip.split('::ffff:')[1] &&
        user.lastLogin &&
        new Date().getTime() - user.lastLogin.getTime() < 7 * 24 * 60 * 60 * 1000
            ? false
            : true;
    }

    private async isUserExist(email?: string, username?: string) {
        return this.userModel.find({$or: [{email}, {username}]});
    }
}