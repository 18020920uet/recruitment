import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';
import { Role } from '@Shared/enums/role';
import { UserEntity } from '@Entities/user.entity';
import { CompanyInformationEntity } from '@Entities/company-information.entity';

export class UserInfo {
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

export class CompanyOwner {
  @AutoMap()
  id: string;

  @AutoMap()
  logo: string;

  @AutoMap()
  name: string;

  @AutoMap()
  stars: number;

  @AutoMap()
  isVerified: boolean;

  @AutoMap({ typeFn: () => UserInfo })
  owner: UserInfo;

  @AutoMap({ typeFn: () => CountryEntity })
  country: CountryEntity;

  @AutoMap({ typeFn: () => AreaEntity })
  area: AreaEntity;

  @AutoMap({ typeFn: () => CompanyInformationEntity })
  information: CompanyInformationEntity;
}

export class GetUsersResponse {
  @ApiProperty()
  users: UserInfo[] | CompanyOwner[];

  @ApiProperty()
  totalRecords: number;
}
