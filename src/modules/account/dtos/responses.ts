import { ApiProperty } from '@nestjs/swagger';

import { User } from '@Shared/responses/user';

export class AccountResponse {
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
