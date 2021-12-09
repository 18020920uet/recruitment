import { IsArray, IsString, Min, Max, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';
import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

export class GetJobsQueries {
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  title: string | null;

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
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      enum: ['Inprogress', 'Pending', 'Await', 'Cancel', 'Done'],
    },
    required: false,
    description: 'Enum: Inprogress, Pending, Await, Cancel, Done',
  })
  statuses: JobStatus[] | null;

  @IsOptional()
  @ApiProperty({ enum: JobWorkMode, enumName: 'JobWorkMode', required: false })
  workMode: JobWorkMode | null;

  @IsOptional()
  @ApiProperty({ description: 'Start date: "yyyy-mm-dd"', type: 'string', required: false })
  startDateBegin: string;

  @IsOptional()
  @ApiProperty({ description: 'End date: "yyyy-mm-dd"', type: 'string', required: false })
  startDateEnd: string;

  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  skillIds: number[] | null;

  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  businessFieldIds: number[] | null;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number', minimum: 1, description: 'page > 1' })
  page: number;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({ type: 'number', required: false, minimum: 1, description: 'Auto = 10, records > 0' })
  records: number;
}

export class GetJobDetailParams {
  @ApiProperty()
  jobId: number;
}

export class CreateJobRequest {
  @ApiProperty()
  title: string;

  @Type(() => Number)
  @Min(1)
  @Max(5)
  @ApiProperty({ maximum: 5, minimum: 1, description: 'Default = 1' })
  maxEmployees: number;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ minimum: 1, description: 'Default = 1' })
  minEmployees: number;

  @ApiProperty()
  description: string;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ minimum: 1 })
  salary: number;

  @ApiProperty({ enum: JobExperience, enumName: 'JobExperience' })
  experience: JobExperience;

  @IsArray()
  @ApiProperty({ type: 'array', items: { type: 'number' } })
  skillIds: number[] | null;

  @ApiProperty({ enum: JobWorkMode, enumName: 'JobWorkMode' })
  workMode: JobWorkMode;

  @ApiProperty({ description: 'Start date >= today, Format: YYYY/MM/DD' })
  startDate: string;

  @ApiProperty({ description: 'End date >= today, Format: YYYY/MM/DD' })
  endDate: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'number' },
    description: 'If array empty => businessFieldIds = ["IT"] ',
  })
  businessFieldIds: number[];

  @ApiProperty({ description: 'areaId = 0 => Company area' })
  areaId: number;
}

export class UpdateJobParams {
  @ApiProperty()
  jobId: number;
}

export class UpdateJobRequest extends CreateJobRequest {
  @ApiProperty({ enum: JobStatus, enumName: 'JobStatus' })
  status: JobStatus;
}

export class DeleteJobParams {
  @ApiProperty()
  jobId: number;
}

export class ApplyJobParams {
  @ApiProperty()
  jobId: number;
}

export class ApplyJobRequest {
  @MinLength(0)
  @MaxLength(1000)
  @ApiProperty({ maxLength: 1000 })
  introduceMessage: string;
}

export class GetCandidatesOfJobParams {
  @ApiProperty()
  jobId: number;
}

export class GetCandidatesOfJobQuerires {
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ enum: JobApplyStatus, enumName: 'JobApplyStatus', required: false })
  applyStatus: JobApplyStatus;

  @IsOptional()
  @ApiProperty({ required: false, description: 'Example 2021-11-29T07:39:04.248Z' })
  appliedAt: Date;

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

export class ChangeJobApplyStatusParams {
  @Type(() => Number)
  @ApiProperty()
  jobId: number;

  @Type(() => String)
  @ApiProperty({ type: 'string', enum: ['Approve', 'Reject'] })
  changeJobApplyStatus: string;

  @IsString()
  @ApiProperty()
  candidateId: string;
}

export class ChangeJobApplyStatusRequest {
  @Type(() => String)
  @ApiProperty({ type: 'string' })
  rejectMessage: string;
}

export class GetEmployeesOfJobParams {
  @ApiProperty()
  jobId: number;
}

export class GetEmployeesOfJobQuerires {
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ enum: JobEmployeeStatus, enumName: 'JobEmployeeStatus', required: false })
  jobEmployeeStatus: JobEmployeeStatus;

  @IsOptional()
  @ApiProperty({ required: false, description: 'Example 2021-11-29T07:39:04.248Z' })
  joinedAt: Date;

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

export class RemoveEmployeeFromJobParams {
  @ApiProperty()
  jobId: number;

  @ApiProperty()
  employeeId: string;
}

export class FinishJobParams {
  @ApiProperty()
  jobId: number;
}

export class CompletedJobByUserParams {
  @ApiProperty()
  jobId: number;
}

export class RemoveApplicationParams {
  @ApiProperty()
  jobId: number;
}

export class ChangeEmployeeStatusJobParams {
  @ApiProperty()
  jobId: number;

  @ApiProperty()
  employeeId: string;

  @IsEnum(['Working', 'Done'])
  @ApiProperty({ type: 'string', enum: ['Working', 'Done']})
  employeeStatus: string;
}
