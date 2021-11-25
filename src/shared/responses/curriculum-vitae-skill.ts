import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { JobExperience } from '@Shared/enums/job-experience';

export class CurriculumVitaeSkill {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  experience: JobExperience;
}
