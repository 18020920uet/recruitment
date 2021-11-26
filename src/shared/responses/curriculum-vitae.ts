import { Gender } from '@Shared/enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CurriculumVitaeExperience } from './curriculum-vitae-experience';
import { CurriculumVitaeSkill } from './curriculum-vitae-skill';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { AreaEntity } from '@Entities/area.entity';

export class CurriculumVitae {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  firstName: string;

  @AutoMap()
  @ApiProperty()
  lastName: string;

  @AutoMap()
  @ApiProperty()
  avatar: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap()
  @ApiProperty({ enum: [1, 2, 3], description: '1: UNDEFINED, 2: FEMALE, 3: MALE' })
  gender: Gender;

  @AutoMap()
  @ApiProperty({ description: 'string "MM/DD/YYYY"' })
  dateOfBirth: string;

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ type: NationalityEntity })
  nationality: NationalityEntity | null;

  @AutoMap()
  @ApiProperty()
  address: string;

  @AutoMap()
  @ApiProperty()
  educations: string;

  @AutoMap()
  @ApiProperty()
  briefIntroduce: string;

  @AutoMap()
  @ApiProperty()
  area: AreaEntity;

  @AutoMap()
  @ApiProperty()
  introduce: string;

  @AutoMap()
  @ApiProperty({ type: [String] })
  certifications: string[];

  @ApiProperty({ type: [LanguageEntity] })
  languages: LanguageEntity[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  hobbies: string[];

  @ApiProperty({ type: [CurriculumVitaeSkill] })
  skills: CurriculumVitaeSkill[];

  @AutoMap({ typeFn: () => CurriculumVitaeExperience })
  @ApiProperty({ type: [CurriculumVitaeExperience] })
  experiences: CurriculumVitaeExperience[];
}
