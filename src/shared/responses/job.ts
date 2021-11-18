import { ApiProperty } from '@nestjs/swagger';

import { AreaEntity } from '@Entities/area.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import { BusinessField } from './business-field';
import { Company } from './company';
import { Skill } from './skill';

export class Job {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: Company })
  company: Company;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: JobExperience, enumName: 'JobExperience' })
  experience: JobExperience;

  @ApiProperty({ enum: JobStatus, enumName: 'JobStatus' })
  status: JobStatus;

  @ApiProperty({ enum: JobWorkMode, enumName: 'JobWorkMode' })
  workMode: JobWorkMode;

  @ApiProperty({ type: [Skill] })
  skills: Skill[];

  @ApiProperty({ type: [BusinessField] })
  businessFields: BusinessField[];

  @ApiProperty({ type: AreaEntity })
  area: AreaEntity;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
