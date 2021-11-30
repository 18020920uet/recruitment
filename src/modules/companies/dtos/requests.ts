import { IsString, MaxLength, IsAlpha, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { JobStatus } from '@Shared/enums/job-status';

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

export class GetCompanyDetailParams {
  @IsString()
  @ApiProperty()
  companyId: string;
}

export class GetJobsOfCompanyParams {
  @IsString()
  @ApiProperty()
  companyId: string;
}

export class GetJobsOfCompanyQueries {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title: string;

  @IsOptional()
  @ApiProperty({ enum: JobStatus, enumName: 'JobStatus', required: false })
  status: JobStatus;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({ required: false })
  areaId: number;

  @IsOptional()
  @ApiProperty({ required: false, description: 'Default = false' })
  withDeleted: boolean = false;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number', minimum: 1, description: 'page > 1' })
  page: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @ApiProperty({ type: 'number', required: false, minimum: 1, description: 'Auto = 10, records > 0' })
  records: number;
}
