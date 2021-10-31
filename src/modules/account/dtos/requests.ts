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

export class ActivateRequest {
  @ApiProperty()
  token: string;
}

export class UnlockRequest {
  @ApiProperty()
  token: string;
}
