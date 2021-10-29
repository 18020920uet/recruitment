import { ApiProperty } from '@nestjs/swagger';

export class RefreshAccessTokenResponse {
  @ApiProperty()
  readonly newAccessToken: string;
}
