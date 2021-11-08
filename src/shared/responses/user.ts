import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { Role } from '../enums/role';

export class User {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap()
  @ApiProperty()
  firstName: string;

  @AutoMap()
  @ApiProperty()
  lastName: string;

  @AutoMap()
  @ApiProperty()
  role: Role;

  @AutoMap()
  @ApiProperty()
  avatar: string;
}
