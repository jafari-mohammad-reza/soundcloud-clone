import { ObjectId, Types } from 'mongoose';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel, UserSchema } from 'src/share/database';
import { JwtModuleService } from 'src/share/services/jwt.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { InvalidCredentialsException } from 'src/share/http/exceptions/InvalidCredentials.exception';
import { verifyPassword } from 'src/share/utils';
import { UserAccountStatus } from 'src/share/database/schemas/user.schema';
import { EmailService } from 'src/share/services/email.service';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
    //TODO : add each method return type
    constructor(@InjectModel(UserModel.name) private readonly userModel:Model<UserModel>,private readonly jwtService:JwtModuleService,private readonly eventEmitter:EventEmitter2,private readonly emailService:EmailService) {}
    async registerUser(registerDto:RegisterDto , ip:string) {
        const {email,username,password} = registerDto
        if((await this.isUserExist(email,username)).length > 0){
            throw new InvalidCredentialsException()
        }
        await this.eventEmitter.emitAsync("user.register" , {email})
        return await this.userModel.create({email,username,password,registerIp:ip.split("::ffff:")[1]})
    }
    async loginUser(loginDto:LoginDto , ip:string) {
        const {email,password} = loginDto
        const user = await this.userModel.findOne({email})
    
    
        if(!user || !verifyPassword(password , user.password)){
            throw new InvalidCredentialsException()
        }        
        if(user.accountStatus !== UserAccountStatus.Active){
            throw new ForbiddenException()
        }
        if(!this.validateLoginActivity(user ,ip)){
            throw new ForbiddenException()
        }
        await this.eventEmitter.emitAsync("user.login" , {email , ip})
        return await this.jwtService.signToken(user._id.toString())
    }
    async activeUserAccount(token:string) {
        const {ext,iat,id} = await this.jwtService.verifyToken(token) as {id:string , iat:number,ext:number}
        if(Date.now() < ext){
            throw new UnauthorizedException()
        }
        return await this.userModel.findByIdAndUpdate(new Types.ObjectId(id) , {$set : {accountStatus:UserAccountStatus.Active}})
    }
    async sendVerificationEmail(email:string){
        //TODO send verification code
        //! Server Address
        // const token = await this.jwtService.signToken(email , "10m")
        const token = "token"
         this.emailService.sendEmail(email , "Verify your account." , `
            <a href="http://localhost:5000/api/v1/auth/verify/${token}">Verify account</a>
         `)
    } 
    async loginEvent(email:string , ip:string){
        //TODO send new login email
         await this.userModel.updateOne({email} , {$set : {lastLogin : new Date()}})
        this.emailService.sendEmail(email , "Verify your account." , `new device logged in your account with ip of ${ip}`)
    }
    async validateLoginActivity(user:UserDocument, ip:string){
        return user.registerIp !== ip && (new Date().getTime() - user.lastLogin.getTime()) < 7 * 24 * 60 * 60 * 1000;        
    }
    private async isUserExist(email?:string , username?:string){
        return await this.userModel.find({$or : [{email} , {username}]})
    }
}
