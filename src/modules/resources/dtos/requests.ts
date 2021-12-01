import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAreasQueries {
  @Type(() => Number)
  @ApiProperty()
  countryId: number;
}
