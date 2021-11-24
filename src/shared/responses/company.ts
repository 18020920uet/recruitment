import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { CountryEntity } from '@Entities/country.entity';

export class Company {
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
  @ApiProperty({ type: CountryEntity })
  country: CountryEntity;

  @AutoMap()
  @ApiProperty()
  logo: string;

  @AutoMap()
  @ApiProperty()
  isVerified: boolean;
}
