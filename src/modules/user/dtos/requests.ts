import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail, IsNotEmpty, MinLength, IsString, IsNumberString,
  Matches, Min, Max, IsPositive, IsInt, NotContains, IsArray, ArrayMaxSize
} from 'class-validator';

import { Gender } from '@Shared/enums/gender';
import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/g, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/g, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/g, { message: 'password must contain at least 1 lowercase character' })
  @Matches(
    /.*[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/g,
    { message: 'password must contain at least 1 special character' }
  )
  @NotContains(' ', { message: 'password must not contain white space' })
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/g, { message: 'password must contain at least 1 number' })
  @Matches(/.*[A-Z].*/g, { message: 'password must contain at least 1 uppercase character' })
  @Matches(/.*[a-z].*/g, { message: 'password must contain at least 1 lowercase character' })
  @Matches(
    /.*[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\-\=\|\\\\].*/g,
    { message: 'password must contain at least 1 special character' }
  )
  @NotContains(' ', { message: 'password must not contain white space' })
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

  @IsNotEmpty()
  @IsString()
  @Matches(
    /[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\=\|\\\\]/g,
    { message: 'firstName must contain only alphabet' }
  )
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\=\|\\\\]/g,
    { message: 'firstName must contain only alphabet' }
  )
  @ApiProperty()
  lastName: string;
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
  @Matches(
    /[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\=\|\\\\]/g,
    { message: 'firstName must contain only alphabet' }
  )
  @ApiProperty()  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /[^\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\"\;\'\<\>\,\.\?\/\~\`\_\+\=\|\\\\]/g,
    { message: 'lastName must contain only alphabet' }
  )
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNumberString()
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

export class GetReviewsQuery {
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer',  minimum: 0 })
  page: number;
}

export class ChangeAvatarRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateCertificationsRequest {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }})
  files: any[];
}
