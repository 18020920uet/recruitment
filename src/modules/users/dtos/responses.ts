import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';

import { CurriculumVitaeSkill } from '@Shared/responses/curriculum-vitae-skill';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { User } from '@Shared/responses/user';
import { Job } from '@Shared/responses/job';
import { JobStatus } from '@Shared/enums/job-status';
import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';
import { JobApplyStatus } from '@Shared/enums/job-apply-status';

export class DeleteReviewResponse {
  status: boolean;
}

export class FreeLancer extends User {
  @AutoMap()
  @ApiProperty()
  briefIntroduce: string;

  @AutoMap()
  @ApiProperty()
  country: CountryEntity;

  @AutoMap()
  @ApiProperty()
  area: AreaEntity;

  @AutoMap()
  @ApiProperty()
  rate: number;

  @ApiProperty({ type: [CurriculumVitaeSkill] })
  skills: CurriculumVitaeSkill[];
}

export class GetUsersResponse {
  @ApiProperty({ type: [FreeLancer] })
  users: FreeLancer[];

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

  @ApiProperty({ type: UserJobsAnalysis })
  jobsAnalysis: UserJobsAnalysis;

  @ApiProperty({ type: [Job] })
  jobs: Job[];
}

export class JobOfUser {
  @ApiProperty()
  jobId: number;

  @ApiProperty()
  jobName: string;

  @ApiProperty()
  isFinished: boolean;

  @ApiProperty()
  jobStatus: JobStatus;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  appliedAt: Date;

  @ApiProperty()
  isJoined: boolean;

  @ApiProperty({ enum: JobEmployeeStatus, type: 'JobEmployeeStatus' })
  jobEmployeeStatus: JobEmployeeStatus;

  @ApiProperty({ enum: JobApplyStatus, type: 'JobApplyStatus' })
  jobApplyStatus: JobApplyStatus;

  @ApiProperty()
  rejectMessage: string;
}

export class GetJobsOfUserResponse {
  @ApiProperty({ type: [JobOfUser] })
  jobsOfUser: JobOfUser[];

  @ApiProperty()
  totalRecords: number;
}
