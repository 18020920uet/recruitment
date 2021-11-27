import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAreasQuery {
  @Type(() => Number)
  @ApiProperty()
  countryId: number;
}
