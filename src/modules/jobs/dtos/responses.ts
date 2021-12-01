import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';

export class JobDetail extends Job {
  @AutoMap()
  @ApiProperty()
  description: string;

  @AutoMap()
  @ApiProperty()
  minEmployees: number;

  @AutoMap()
  @ApiProperty()
  maxEmployees: number;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  updateAt: Date;

  @AutoMap({ typeFn: () => User })
  @ApiProperty()
  creator: User;

  @AutoMap({ typeFn: () => User })
  @ApiProperty()
  lastUpdater: User;

  @AutoMap({ typeFn: () => User })
  @ApiProperty()
  deletedAt: Date;
}

export class GetJobDetailResponse {
  @ApiProperty({ type: JobDetail })
  jobDetail: JobDetail;

  @AutoMap({ typeFn: () => Job })
  @ApiProperty({ type: [Job] })
  relatedJobs: Job[];
}

export class GetJobsResponse {
  @ApiProperty({ type: [Job] })
  jobs: Job[];

  @ApiProperty()
  totalRecords: number;
}

export class DeleteJobResponse {
  @ApiProperty({ type: 'boolean' })
  status: boolean;
}

export class CandidateOfJob {
  @AutoMap()
  @ApiProperty()
  jobId: number;

  @AutoMap({ typeFn: () => User })
  @ApiProperty({ type: User })
  user: User;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  updatedAt: Date | null;

  @AutoMap()
  @ApiProperty({ enum: JobApplyStatus, enumName: 'JobApplyStatus' })
  applyStatus: JobApplyStatus;

  @AutoMap({ typeFn: () => User })
  @ApiProperty({ type: User })
  editor: User | null;

  @AutoMap()
  @ApiProperty()
  introduceMessage: string;

  @AutoMap()
  @ApiProperty()
  rejectMessage: string;
}

export class EmployeeOfJob {
  @AutoMap()
  @ApiProperty()
  jobId: number;

  @AutoMap({ typeFn: () => User })
  @ApiProperty({ type: User })
  user: User;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  updatedAt: Date | null;

  @AutoMap()
  @ApiProperty({ enum: JobEmployeeStatus, enumName: 'JobEmployeeStatus' })
  employeeStatus: JobEmployeeStatus;

  @AutoMap({ typeFn: () => User })
  @ApiProperty({ type: User })
  editor: User | null;
}

export class GetEmployeesOfJobResponse {
  @ApiProperty({ type: [EmployeeOfJob] })
  employees: EmployeeOfJob[];

  @ApiProperty()
  totalRecods: number;

  @ApiProperty()
  maxEmployees: number;

  @ApiProperty()
  totalEmployees: number;
}

export class GetCandidatesOfJobResponse {
  @ApiProperty({ type: [CandidateOfJob] })
  candidates: CandidateOfJob[];

  @ApiProperty()
  totalRecods: number;

  @ApiProperty()
  maxEmployees: number;

  @ApiProperty()
  totalEmployees: number;
}
