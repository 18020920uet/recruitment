import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { AreaEntity } from '@Entities/area.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

import { BusinessField } from './business-field';
import { Company } from './company';
import { Skill } from './skill';

export class Job {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  salary: number;

  @AutoMap()
  @ApiProperty()
  title: string;

  @AutoMap()
  @ApiProperty({ enum: JobExperience, enumName: 'JobExperience' })
  experience: JobExperience;

  @AutoMap()
  @ApiProperty({ enum: JobStatus, enumName: 'JobStatus' })
  status: JobStatus;

  @AutoMap()
  @ApiProperty()
  startDate: string;

  @AutoMap()
  @ApiProperty()
  endDate: string;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  updatedAt: Date;

  @AutoMap()
  @ApiProperty({ enum: JobWorkMode, enumName: 'JobWorkMode' })
  workMode: JobWorkMode;

  @AutoMap({ typeFn: () => Company })
  @ApiProperty({ type: Company })
  company: Company;

  @AutoMap({ typeFn: () => Skill })
  @ApiProperty({ type: [Skill] })
  skills: Skill[];

  @AutoMap({ typeFn: () => BusinessField })
  @ApiProperty({ type: [BusinessField] })
  businessFields: BusinessField[];

  @AutoMap({ typeFn: () => AreaEntity })
  @ApiProperty({ type: AreaEntity })
  area: AreaEntity;
}
