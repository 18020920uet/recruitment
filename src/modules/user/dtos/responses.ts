import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { User } from '@Shared/responses/user';

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
