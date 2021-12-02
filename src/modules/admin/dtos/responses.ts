import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';
import { Role } from '@Shared/enums/role';

export class FreeLancer {
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

  @AutoMap()
  @ApiProperty()
  isActivated: boolean;

  @AutoMap()
  @ApiProperty()
  isLock: boolean;
}

export class Company extends User {}

export class Admin extends User {}

export class GetUsersResponse {
  @ApiProperty()
  users: FreeLancer[];

  @ApiProperty()
  totalRecords: number;
}
