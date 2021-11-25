import { Gender } from '@Shared/enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CurriculumVitaeExperience } from './curriculum-vitae-experience';
import { Skill } from './skill';

import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';

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
  introduce: string;

  @AutoMap()
  @ApiProperty({ type: [String] })
  certifications: string[];

  @ApiProperty({ type: [LanguageEntity] })
  languages: LanguageEntity[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  hobbies: string[];

  @AutoMap({ typeFn: () => Skill })
  @ApiProperty({ type: [Skill] })
  skills: Skill[];

  @AutoMap({ typeFn: () => CurriculumVitaeExperience })
  @ApiProperty({ type: [CurriculumVitaeExperience] })
  experiences: CurriculumVitaeExperience[];
}
