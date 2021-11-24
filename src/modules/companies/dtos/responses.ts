import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { Company } from '@Shared/responses/company';

export class CompanyInformation {
  @AutoMap()
  @ApiProperty()
  id: string;

  @ApiProperty()
  addresses: string[];

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @AutoMap()
  @ApiProperty()
  description: string;

  @ApiProperty()
  photos: string[];

  @AutoMap()
  @ApiProperty()
  numberOfEmployees: number;

  @AutoMap()
  @ApiProperty()
  paxNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Social network by field Example: { facebook: "fb", linkedin: "linkedin", ... }',
    type: 'object'
  })
  socialNetworks: object;
}

class BusinessField {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetCompanyDetailResponse extends Company {
  @AutoMap()
  @ApiProperty()
  information: CompanyInformation;

  @ApiProperty({ type: [BusinessField] })
  businessFields: BusinessField[];

  @AutoMap()
  @ApiProperty({ type: AreaEntity })
  area: AreaEntity;
}
