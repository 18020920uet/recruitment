import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, Matches, NotContains } from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/, { message: 'password must contain at least 1 lowercase character' })
  @Matches(
    /.*[\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/,
    { message: 'password must contain at least 1 special character' }
  )
  @NotContains(' ', { message: 'password must not contain white space' })
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
  @MinLength(8)
  @Matches(/.*\d.*/, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/, { message: 'password must contain at least 1 lowercase character' })
  @Matches(
    /.*[\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/,
    { message: 'password must contain at least 1 special character' }
  )
  @NotContains(' ', { message: 'password must not contain white space' })
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
