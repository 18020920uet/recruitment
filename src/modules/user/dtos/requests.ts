import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumberString,
  Matches,
  Min,
  Max,
  IsPositive,
  NotContains,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Gender } from '@Shared/enums/gender';
import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/, { message: 'password must contain at least 1 lowercase character' })
  @Matches(/.*[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/, {
    message: 'password must contain at least 1 special character',
  })
  @NotContains(' ', { message: 'password must not contain white space' })
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/, { message: 'password must contain at least 1 lowercase character' })
  @Matches(/.*[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/, {
    message: 'password must contain at least 1 special character',
  })
  @NotContains(' ', { message: 'password must not contain white space' })
  @ApiProperty()
  newPassword: string;
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
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNumberString()
  @ApiProperty()
  phoneNumber: string | null;

  @IsPositive()
  @Min(5)
  @Max(150)
  @ApiProperty({ minimum: 5, maximum: 150 })
  minimalHourlyRate: number;

  @IsPositive()
  @ApiProperty()
  nationality: number | null;

  @ApiProperty({ description: 'month/date/year. new Date("MM/DD/YYYY").toLocaleDateString("en-Us")' })
  dateOfBirth: string;

  @ApiProperty({ enum: [2, 3], description: '2: FEMALE, 3: MALE' })
  gender: Gender;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  educations: string;

  @IsString()
  @ApiProperty()
  introduce: string;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ type: [String] })
  languages: string[];

  @ApiProperty({ type: [String] })
  hobbies: string[];

  @ApiProperty({ type: [UpdateCurriculumnVitaeExperienceRequest] })
  experiences: UpdateCurriculumnVitaeExperienceRequest[];
}

export class ChangeAvatarRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateCertificationsRequest {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}
