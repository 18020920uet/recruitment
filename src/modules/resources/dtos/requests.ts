import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAreasQuery {
  @Type(() => Number)
  @ApiProperty()
  countryId: number;
}
