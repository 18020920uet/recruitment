import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { Role } from '@Shared/enums/role';
import { User } from '@Shared/responses/user';

export class ProfileResponse {
  @AutoMap()
  @ApiProperty()
  user: User;

  @AutoMap()
  @ApiProperty()
  skills: string;

  @AutoMap()
  @ApiProperty()
  minimalHourlyRate: number;

  @AutoMap()
  @ApiProperty()
  nationality: number | null;

  @AutoMap()
  @ApiProperty()
  introduce: string;
}

export class ChangePasswordResponse {
  @ApiProperty()
  status: boolean
}
