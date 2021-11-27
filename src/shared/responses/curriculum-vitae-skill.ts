import { ApiProperty } from '@nestjs/swagger';

import { JobExperience } from '@Shared/enums/job-experience';

export class CurriculumVitaeSkill {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  experience: JobExperience;
}
