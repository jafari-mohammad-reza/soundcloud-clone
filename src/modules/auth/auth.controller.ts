import {Body, Controller, Get, Ip, Param, Post} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiParam, ApiTags} from '@nestjs/swagger';
import {LoginDto, RegisterDto} from './auth.dto';
import {OnEvent} from '@nestjs/event-emitter';
import {AuthService} from './auth.service';

@Controller({
    path:'auth',
    version:'1'
})
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @ApiBody({type: RegisterDto, required: true})
    @ApiConsumes('application/x-www-form-urlencoded')
    async register(@Body() dto: RegisterDto, @Ip() ip: string) {
        return await this.authService.registerUser(dto, ip);
    }

    @Post('login')
    @ApiBody({type: LoginDto, required: true})
    @ApiConsumes('application/x-www-form-urlencoded')
    async login(@Body() dto: LoginDto, @Ip() ip: string) {
        return await this.authService.loginUser(dto, ip);
    }

    @Get('/verify/:token')
    @ApiParam({name: 'token', type: 'string', required: true})
    async verifyAccount(@Param('token') token: string) {
        return await this.authService.activeUserAccount(token);
    }

    @OnEvent('user.register')
    async userRegister({email}: { email: string }) {
        await this.authService.sendVerificationEmail(email);
    }

    @OnEvent('user.login')
    async loginRegister({email, ip}: { email: string; ip: string }) {
        await this.authService.loginEvent(email, ip);
    }
}
