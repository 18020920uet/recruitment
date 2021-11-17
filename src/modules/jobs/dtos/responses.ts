import { ApiProperty } from '@nestjs/swagger';

import { AreaEntity } from '@Entities/area.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import { BusinessField } from '@Shared/responses/business-field';
import { Company } from '@Shared/responses/company';
import { Skill } from '@Shared/responses/skill';
import { Job } from '@Shared/responses/job';


export class JobDetail extends Job {
  @ApiProperty()
  description: string;

  @ApiProperty()
  minEmployees: number;

  @ApiProperty()
  maxEmployees: number;
}


export class GetJobDetailResponse {
  @ApiProperty({ type: JobDetail })
  jobDetail: JobDetail;

  @ApiProperty({ type: [Job] })
  relatedJobs: Job[];
}

export class GetJobsResponse {
  @ApiProperty({ type: [Job] })
  jobs: Job[];

  @ApiProperty()
  totalRecords: number;
}
