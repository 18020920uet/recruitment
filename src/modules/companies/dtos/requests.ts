import { IsString, MaxLength, IsAlpha, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetCompaniesFilterWithTheFirstCharacterInNameQuery {
  @IsAlpha()
  @IsString()
  @IsOptional()
  @MaxLength(1, { message: 'Only contain 1 charater' })
  @ApiProperty({ required: false })
  character: string | null;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number' })
  page: number;
}

export class GetCompanyDetailParam {
  @IsString()
  @ApiProperty()
  companyId: string;
}
