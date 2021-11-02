import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
