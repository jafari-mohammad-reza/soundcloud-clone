import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  @IsEmail({ domain_specific_validation: true })
  @Matches(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/)
  @ApiProperty({
    type: 'email',
    required: true,
    name: 'email',
  })
  email: string;
  @IsString()
  @ApiProperty({
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 16,
    name: 'username',
  })
  username: string;
  @IsString()
  @Matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%? "]).*$/)
  @Length(8, 16)
  @ApiProperty({
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 16,
    name: 'password',
  })
  password: string;
}

export class RegisterDto extends PickType(AuthDto, [
  'username',
  'email',
  'password',
]) {}

export class LoginDto extends PickType(AuthDto, ['password', 'email']) {}
