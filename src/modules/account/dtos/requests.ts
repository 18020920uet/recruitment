import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[@$!%*#?&])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must contain aleast 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character'
  })
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastName: string;
}

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[@$!%*#?&])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must contain aleast 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character'
  })
  @ApiProperty()
  password: string;
}

export class ActivateRequest {
  @IsString()
  @ApiProperty()
  token: string;
}

export class UnlockRequest {
  @IsString()
  @ApiProperty()
  token: string;
}
