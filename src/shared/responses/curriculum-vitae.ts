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
  @ApiProperty()
  gender: Gender;

  @AutoMap()
  @ApiProperty()
  dateOfBirth: Date;

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
  @ApiProperty({ description: 'Skills split by "|". Example: "React Redux|OOP|Problem-solving"' })
  skills: string;

  @AutoMap()
  @ApiProperty({
    description: 'Start - End: Place; split by "|". Example: "08/2015 - 05/2018: Highschool|01/2021 - 07/2021: UET"',
  })
  educations: string;

  @AutoMap()
  @ApiProperty({ type: [String] })
  certifications: string[];

  @AutoMap()
  @ApiProperty({ description: 'Split by "|". Exapmple: "1|2|3"' })
  languages: string;

  @AutoMap()
  @ApiProperty({ description: 'Split by "|". Exapmple: "Football|Video Games|Listen to music"' })
  hobbies: string;

  @AutoMap()
  @ApiProperty()
  introduce: string;

  @AutoMap({ typeFn: () => CurriculumVitaeExperience })
  @ApiProperty({ type: [CurriculumVitaeExperience] })
  experiences: CurriculumVitaeExperience[];

  @AutoMap()
  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;
}
