import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponse {
  @ApiProperty()
  status: boolean;
}

export class ChangeAvatarResponse {
  @ApiProperty()
  avatar: string;
}

export class UpdateCertificationsResponse {
  @ApiProperty({ type: [String] })
  certifications: string[];
}
