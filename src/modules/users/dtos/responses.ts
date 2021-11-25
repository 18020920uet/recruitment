import { ApiProperty } from '@nestjs/swagger';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';


export class DeleteReviewResponse {
  status: boolean;
}

export class FreeLancer extends User {
  @ApiProperty()
  briefIntroduce: string;

  @ApiProperty()
  country: CountryEntity;

  @ApiProperty()
  area: AreaEntity;

  @ApiProperty()
  rate: number;
}

export class GetUsersResponse {
  @ApiProperty({ type: FreeLancer })
  users: FreeLancer;

  @ApiProperty()
  totalRecords: number;
}

export class UserJobsAnalysis {
  @ApiProperty()
  totalJobs: number;

  @ApiProperty()
  totalDoneJobs: number;

  @ApiProperty()
  totalAppliedJobs: number;
}

export class GetUserProfileResponse {
  @ApiProperty({ type: CurriculumVitae })
  cv: CurriculumVitae;

  @ApiProperty({ type: [Review] })
  reviews: Review[];

  @ApiProperty({ type: UserJobsAnalysis})
  jobsAnalysis: UserJobsAnalysis;

  @ApiProperty({ type: [Job] })
  jobs: Job[]
}
