import { IsString, MaxLength, IsAlpha, Min, IsOptional, IsNumberString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { JobStatus } from '@Shared/enums/job-status';

export class GetCompaniesFilterWithTheFirstCharacterInNameQueries {
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

export class UpdateCompanyInformationParams {
  @IsString()
  @ApiProperty()
  companyId: string;
}

export class UpdateCompanyInformationRequest {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  logo: any;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  photos: any[];

  @Type(() => Number)
  @ApiProperty()
  countryId: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  areaId: number;

  @Transform(({ value }) =>
    String(value)
      .split(',')
      .map((v) => Number(v))
      .filter((v) => v),
  )
  @ApiProperty({
    type: 'array',
    items: { type: 'number' },
    description: 'Format: "businessFieldIds=1,2,3"',
    required: false,
  })
  businessFieldIds: number[];

  @IsNumberString()
  @ApiProperty()
  phoneNumber: string;

  @IsNumberString()
  @ApiProperty()
  paxNumber: string;

  @ApiProperty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  numberOfEmployees: number;

  @ApiProperty({ type: 'object' })
  socialNetworks: Record<string, string>;

  @ApiProperty({ description: 'mm-dd-yyyy' })
  dateOfEstablishment: string;

  @Transform(({ value }) =>
    String(value)
      .split(',')
      .filter((v) => v),
  )
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Format: "addresses=23 Cau giay,24 Cau giay"',
    required: false,
  })
  addresses: string[];
}

export class GetJobsOfCompanyParams {
  @IsString()
  @ApiProperty()
  companyId: string;
}

export class GetCompanyAnalysisParams {
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
