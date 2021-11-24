import { IsString, MaxLength, IsAlpha, Min, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

export class GetJobsQuery {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ type: 'number', required: false })
  areaId: number | null;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({ type: 'number', required: false })
  salary: number | null;

  @IsOptional()
  @ApiProperty({ enum: JobExperience, enumName: 'JobExperience', required: false })
  experience: JobExperience | null;

  @IsOptional()
  @ApiProperty({ enum: JobStatus, enumName: 'JobStatus', required: false })
  status: JobStatus | null;

  @IsOptional()
  @ApiProperty({ enum: JobWorkMode, enumName: 'JobWorkMode', required: false })
  workMode: JobWorkMode | null;

  @IsOptional()
  @ApiProperty({ description: 'Start date: "yyyy-mm-dd"', type: 'string', required: false })
  startDate: string;

  @IsOptional()
  @ApiProperty({ description: 'End date: "yyyy-mm-dd"', type: 'string', required: false })
  endDate: string;

  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  skillIds: number[] | null;

  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  businessFieldIds: number[] | null;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number' })
  page: number;
}

export class GetJobDetailParam {
  @IsString()
  @ApiProperty()
  jobId: number;
}
