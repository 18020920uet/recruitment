import { ApiProperty } from '@nestjs/swagger';

import { User } from '@Shared/responses/user';

export class RegisterResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LoginResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class ActivateAccountResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class UnlockAccountResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class RequestResetPasswordResponse {
  @ApiProperty()
  status: boolean;
}
