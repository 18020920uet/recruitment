import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateNewAccessTokenRequest {
  @IsString()
  @ApiProperty()
  token: string;
}
