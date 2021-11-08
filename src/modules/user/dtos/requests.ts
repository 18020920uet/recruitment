import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, Matches, Min, Max } from 'class-validator';

import { Gender } from '@Shared/enums/gender';
import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[@$!%*#?&])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must contain aleast 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character'
  })
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[@$!%*#?&])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must contain aleast 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character'
  })
  @ApiProperty()
  newPassword: string;
}

export class UpdateProfileRequest {
  @IsString()
  @ApiProperty({ description: 'Các skill tách nhau bởi ký tự "|". Ví dụ: "React Redux|OOP|Problem-solving"' })
  skills: string;

  @IsPositive()
  @Min(5)
  @Max(150)
  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @IsPositive()
  @ApiProperty()
  nationality: number | null;

  @IsString()
  @ApiProperty()
  introduce: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
}

export class ChangeAvatarRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateCurriculumnVitaeExperienceRequest {
  @IsEmail()
  @ApiProperty()
  companyEmail: string;

  @IsString()
  @ApiProperty()
  companyName: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @IsString()
  @ApiProperty()
  role: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['work', 'volunteer'] })
  type: CurriculumVitaeExperienceType;
}

export class UpdateCurriculumnVitaeRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string | null;

  @IsString()
  @ApiProperty({ description: 'Các skill tách nhau bởi ký tự "|". Ví dụ: "React Redux|OOP|Problem-solving"' })
  skills: string;

  @IsPositive()
  @Min(5)
  @Max(150)
  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @IsPositive()
  @ApiProperty()
  nationality: number | null;

  @ApiProperty({ enum: [2, 3] })
  gender: Gender;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty({
    description: 'Start - End: Place; split by "|". Example: "08/2015 - 05/2018: Highschool|01/2021 - 07/2021: UET"',
  })
  educations: string;

  @IsString()
  @ApiProperty({ description: 'Split by "|". Exapmple: "Alogirthm|OOP|Unity"' })
  certifications: string;

  @ApiProperty({ description: 'Split by "|". Exapmple: "1|2|3"' })
  @IsString()
  languages: string;

  @IsString()
  @ApiProperty({ description: 'Split by "|". Exapmple: "Football|Video Games|Listen to music"' })
  hobbies: string;

  @IsString()
  @ApiProperty()
  introduce: string;

  @ApiProperty({ type: [UpdateCurriculumnVitaeExperienceRequest] })
  experiences: UpdateCurriculumnVitaeExperienceRequest[];
}
