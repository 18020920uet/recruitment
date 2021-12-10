import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { AreaEntity } from '@Entities/area.entity';

import { Company } from '@Shared/responses/company';
import { Skill } from '@Shared/responses/skill';
import { Job } from '@Shared/responses/job';

export class CompanyInformation {
  @AutoMap()
  @ApiProperty()
  id: string;

  @ApiProperty()
  addresses: string[];

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @AutoMap()
  @ApiProperty()
  description: string;

  @ApiProperty()
  photos: string[];

  @AutoMap()
  @ApiProperty()
  numberOfEmployees: number;

  @AutoMap()
  @ApiProperty()
  paxNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Social network by field Example: { facebook: "fb", linkedin: "linkedin", ... }',
    type: 'object',
  })
  socialNetworks: Record<string, unknown>;
}

class BusinessField {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetCompanyDetailResponse extends Company {
  @AutoMap()
  @ApiProperty()
  information: CompanyInformation;

  @ApiProperty({ type: [BusinessField] })
  businessFields: BusinessField[];

  @AutoMap()
  @ApiProperty({ type: AreaEntity })
  area: AreaEntity;
}

export class JobOfCompany extends Job {
  @ApiProperty()
  totalEmployees: number;

  @ApiProperty()
  totalCandidates: number;
}

export class GetJobsOfCompanyResponse {
  @ApiProperty({ type: JobOfCompany })
  jobs: JobOfCompany[];

  @ApiProperty()
  totalRecods: number;
}

export class AreaCount extends AreaEntity {
  @ApiProperty()
  total: number;
}

export class SkillCount extends Skill {
  @ApiProperty()
  total: number;
}

export class GetCompanyAnalysisResponse {
  @ApiProperty()
  currentEmployeesWorking: number;

  @ApiProperty()
  totalReviewsWritten: number;

  @ApiProperty()
  totalHiredEmployees: number;

  @ApiProperty()
  currentWorkingJobs: number;

  @ApiProperty()
  totalCancelJobs: number;

  @ApiProperty()
  totalPostedJobs: number;

  @ApiProperty()
  totalSalaryPay: number;

  @ApiProperty()
  totalDoneJobs: number;

  @ApiProperty()
  totalPendingJobs: number;

  @ApiProperty()
  totalAwaitJobs: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  highestJobSalaryPay: number;

  @ApiProperty()
  lowestJobSalaryPay: number;

  @ApiProperty({ description: 'Min = 0, max = 5' })
  highestReviewPoint: number;

  @ApiProperty({ description: 'Min = 0, max = 5' })
  lowestReviewPoint: number;

  @ApiProperty({ type: [AreaCount] })
  areas: AreaCount[];

  @ApiProperty({ type: [SkillCount] })
  skills: SkillCount[];
}
