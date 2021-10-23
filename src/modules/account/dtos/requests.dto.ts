import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;
}

export class LoginRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class ChangePasswordRequest {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
