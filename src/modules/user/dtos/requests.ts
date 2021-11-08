import { ApiProperty } from '@nestjs/swagger';

import { Gender } from '@Shared/enums/gender';
import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

export class ChangePasswordRequest {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class UpdateProfileRequest {
  @ApiProperty({ description: 'Các skill tách nhau bởi ký tự "|". Ví dụ: "React Redux|OOP|Problem-solving"' })
  skills: string;

  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @ApiProperty()
  nationality: number | null;

  @ApiProperty()
  introduce: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class ChangeAvatarRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateCurriculumnVitaeExperienceRequest {
  @ApiProperty()
  companyEmail: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  role: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['work', 'volunteer'] })
  type: CurriculumVitaeExperienceType;
}

export class UpdateCurriculumnVitaeRequest {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string | null;

  @ApiProperty({ description: 'Các skill tách nhau bởi ký tự "|". Ví dụ: "React Redux|OOP|Problem-solving"' })
  skills: string;

  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @ApiProperty()
  nationality: number | null;

  @ApiProperty({ enum: [2, 3] })
  gender: Gender;

  @ApiProperty()
  address: string;

  @ApiProperty({
    description: 'Start - End: Place; split by "|". Example: "08/2015 - 05/2018: Highschool|01/2021 - 07/2021: UET"',
  })
  educations: string;

  @ApiProperty({ description: 'Split by "|". Exapmple: "Alogirthm|OOP|Unity"' })
  certifications: string;

  @ApiProperty({ description: 'Split by "|". Exapmple: "1|2|3"' })
  languages: string;

  @ApiProperty({ description: 'Split by "|". Exapmple: "Football|Video Games|Listen to music"' })
  hobbies: string;

  @ApiProperty()
  introduce: string;

  @ApiProperty({ type: [UpdateCurriculumnVitaeExperienceRequest] })
  experiences: UpdateCurriculumnVitaeExperienceRequest[];
}
