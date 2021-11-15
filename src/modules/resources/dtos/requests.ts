import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStatesQuery {
  @Type(() => Number)
  @ApiProperty()
  countryId: number;
}

export class GetCitiesQuery {
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty()
  countryId: number | null;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false })
  stateId: number | null;
}
