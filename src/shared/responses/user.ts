import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { Role } from '../enums/role';

export class User {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  email: string;

  @AutoMap()
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  @AutoMap()
  lastName: string;

  @ApiProperty()
  @AutoMap()
  role: Role;
}
