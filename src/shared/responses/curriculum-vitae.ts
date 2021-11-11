import { Gender } from '@Shared/enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { CurriculumVitaeExperience } from './curriculum-vitae-experience';

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
  @ApiProperty({ description: 'string "MM/DD/YYYY"'})
  dateOfBirth: string;

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @AutoMap()
  @ApiProperty()
  nationality: number;

  @AutoMap()
  @ApiProperty()
  address: string;

  @AutoMap()
  @ApiProperty()
  educations: string;

  @AutoMap()
  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @AutoMap()
  @ApiProperty()
  introduce: string;

  @AutoMap()
  @ApiProperty({ type: [String] })
  certifications: string[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  languages: string[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  hobbies: string[];

  @AutoMap()
  @ApiProperty({ type: [String] })
  skills: string;

  @AutoMap({ typeFn: () => CurriculumVitaeExperience })
  @ApiProperty({ type: [CurriculumVitaeExperience] })
  experiences: CurriculumVitaeExperience[];
}
