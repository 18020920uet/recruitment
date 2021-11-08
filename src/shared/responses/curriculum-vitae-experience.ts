import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class CurriculumVitaeExperience {
  @AutoMap()
  id: number;

  @AutoMap()
  @ApiProperty()
  index: number;

  @AutoMap()
  @ApiProperty()
  companyEmail: string;

  @AutoMap()
  @ApiProperty()
  companyName: string;

  @AutoMap()
  @ApiProperty()
  startDate: Date;

  @AutoMap()
  @ApiProperty()
  endDate: Date;

  @AutoMap()
  @ApiProperty()
  role: string;

  @AutoMap()
  @ApiProperty()
  description: string;

  @AutoMap({ typeFn: () => String })
  @ApiProperty()
  type: CurriculumVitaeExperienceType;
}
