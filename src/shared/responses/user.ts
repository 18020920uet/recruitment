import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { Role } from '../enums/role';

import { CompanyEmployeeEntity } from '@Entities/company-employee.entity';

import { Company } from './company';
import { CompanyRole } from '@Shared/enums/company-role';

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

  @AutoMap({ typeFn: () => CompanyEmployeeEntity })
  @ApiProperty({ type: Company })
  company: Company;

  @AutoMap()
  @ApiProperty({ enum: CompanyRole, enumName: 'CompanyName' })
  companyRole: CompanyRole;
}
