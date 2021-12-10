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
  currentAppliedJobs: number;

  @ApiProperty()
  totalApprovedJobs: number;

  @ApiProperty({ description: 'Apply for job but got rejected' })
  totalRejectedJobs: number;

  @ApiProperty()
  currentWorkingJobs: number;

  @ApiProperty()
  totalDoneJobs: number;

  @ApiProperty({ description: 'Total time got remove of job' })
  totalTimeRemovedFromJob: number;

  @ApiProperty({ description: 'Total time completed job before deadline' })
  totalOnTimeJobs: number;
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

export class GetUserAnalysisResponse extends UserJobsAnalysis {
  @ApiProperty({ description: 'Total salary of all job' })
  totalSalary: number;

  @ApiProperty()
  highestJobSalary: number;

  @ApiProperty()
  lowestJobSalary: number;

  @ApiProperty({ description: 'Min = 0, max = 5' })
  highestReviewPoint: number;

  @ApiProperty({ description: 'Min = 0, max = 5' })
  lowestReviewPoint: number;

  @ApiProperty()
  totalReviewsByCompany: number;

  @ApiProperty()
  totalReviewsWritten: number;

  @ApiProperty({ description: 'Recommendation percent: reviewPoint / totalReviewsByCompany' })
  recommendation: number;

  @ApiProperty()
  rate: number;
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

  @ApiProperty()
  salary: number;
}

export class GetJobsOfUserResponse {
  @ApiProperty({ type: [JobOfUser] })
  jobsOfUser: JobOfUser[];

  @ApiProperty()
  totalRecords: number;
}
