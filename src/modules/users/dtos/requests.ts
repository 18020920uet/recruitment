import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Min, Max, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { JobExperience } from '@Shared/enums/job-experience';
import { Role } from '@Shared/enums/role';

export class GetReviewsQuery {
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number' })
  page: number;
}

export class CreateReviewParam {
  @IsString()
  @ApiProperty()
  userId: string;
}

export class GetReviewsParam {
  @IsString()
  @ApiProperty()
  userId: string;
}

export class GetCvParam {
  @IsString()
  @ApiProperty()
  userId: string;
}

export class UpdateReviewParams {
  @IsString()
  @ApiProperty()
  userId: string;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number' })
  reviewId: number;
}

export class DeleteReviewParams {
  @IsString()
  @ApiProperty()
  userId: string;

  @Type(() => Number)
  @Min(0)
  @ApiProperty({ type: 'number' })
  reviewId: number;
}

export class CreateReviewRequest {
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({ type: 'number', minimum: 0, description: 'float' })
  rate: number;

  @IsString()
  @MaxLength(200)
  @ApiProperty({ type: 'string', maxLength: 200 })
  comment: string;
}

export class UpdateReviewRequest {
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({ type: 'number', minimum: 0, description: 'float' })
  rate: number;

  @IsString()
  @MaxLength(200)
  @ApiProperty({ type: 'string', maxLength: 200 })
  comment: string;
}

export class GetUsersQuery {
  @IsOptional()
  @ApiProperty({ type: 'number', required: false, description: '0 = ADMIN, 1 = COMPANY, 2 = FREELANCE' })
  role: Role | null;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  name: string | null;

  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  skillIds: number[] | null;

  @IsOptional()
  @ApiProperty({ enum: JobExperience, enumName: 'JobExperience', required: false })
  experience: JobExperience | null;

  @Type(() => Number)
  @IsOptional()
  @Min(0)
  @ApiProperty({ type: 'number', description: 'areaId', required: false })
  areaId: number;

  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  languageIds: string[] | null;

  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ type: 'number', description: 'rate > 0 && rate < 5', required: false })
  rate: number | null;

  @Type(() => Number)
  @Min(1)
  @ApiProperty({ type: 'number', minimum: 1, description: 'page > 1' })
  page: number;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({ type: 'number', required: false, minimum: 1, description: 'Auto = 10, records > 0' })
  records: number;
}

export class GetUserProfileParams {
  @ApiProperty()
  userId: string;
}
