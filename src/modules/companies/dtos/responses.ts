import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CountryEntity } from '@Entities/country.entity';

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

export class GetCompanyDetail {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  stars: number;

  @AutoMap({ typeFn: () => CountryEntity })
  @ApiProperty()
  country: CountryEntity;

  @AutoMap()
  @ApiProperty()
  logo: string;

  @AutoMap()
  @ApiProperty()
  isVerified: boolean;

  @AutoMap()
  @ApiProperty()
  information: CompanyInformation;

  @ApiProperty()
  businessFields: BusinessField[];
}

class BusinessField {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
