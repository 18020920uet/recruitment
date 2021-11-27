import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

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
