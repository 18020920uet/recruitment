import { ApiProperty } from '@nestjs/swagger';

export class GenerateNewAccessTokenRequest {
  @ApiProperty()
  token: string;
}
