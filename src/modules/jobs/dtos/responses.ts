import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { AreaEntity } from '@Entities/area.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import { BusinessField } from '@Shared/responses/business-field';
import { Company } from '@Shared/responses/company';
import { Skill } from '@Shared/responses/skill';
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
