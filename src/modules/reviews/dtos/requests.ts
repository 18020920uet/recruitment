import { IsNotEmpty, IsString, MaxLength, Min, Max, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewOfJobFromUserParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  jobId: number;
}

export class CreateReviewOfJobFromUserRequest {
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({ type: 'number', minimum: 0, description: 'float' })
  rate: number;

  @IsString()
  @MaxLength(5000)
  @ApiProperty({ type: 'string', maxLength: 5000 })
  comment: string;
}

export class CreateReviewOfJobFromCompanyParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  jobId: number;

  @IsString()
  @ApiProperty()
  userId: string;
}

export class CreateReviewOfJobFromCompanyRequest {
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({ type: 'number', minimum: 0, description: 'float' })
  rate: number;

  @IsString()
  @MaxLength(5000)
  @ApiProperty({ type: 'string', maxLength: 5000 })
  comment: string;
}

export class UpdateReviewParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  reviewId: number;
}

export class UpdateReviewRequest {
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({ type: 'number', minimum: 0, description: 'float' })
  rate: number;

  @IsString()
  @MaxLength(5000)
  @ApiProperty({ type: 'string', maxLength: 5000 })
  comment: string;
}

export class DeleteReviewParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  reviewId: number;
}

export class GetReviewParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  reviewId: number;
}

export class GetReviewsOfJobParams {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  jobId: number;

  @IsEnum(['byUser', 'byCompany', 'byUserAndByCompany'])
  @IsString()
  @ApiProperty({ type: 'string', enum: ['byUser', 'byCompany', 'byUserAndByCompany'] })
  type: string;
}

export class GetReviewsOfUserParams {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsEnum(['byUser', 'fromCompany'])
  @IsString()
  @ApiProperty({
    type: 'string',
    enum: ['byUser', 'fromCompany'],
    description: 'byUser = reviews create by User for Company, fromCompany = reviews create by Company for User',
  })
  type: string;
}

export class GetReviewsOfCompanyParams {
  @IsString()
  @ApiProperty()
  companyId: string;

  @IsEnum(['byCompany', 'fromUser'])
  @IsString()
  @ApiProperty({
    type: 'string',
    enum: ['byCompany', 'fromUser'],
    description: 'byCompany = reviews create by Company for User, fromUser = reviews create by User for Company',
  })
  type: string;
}

export class GetReviewsQueries {
  @ApiProperty({ description: 'Rate > number', required: false })
  rateFrom: number;

  @ApiProperty({ description: new Date().toString(), required: false })
  createdAtBegin: Date;

  @ApiProperty({ description: new Date().toString(), required: false })
  createdAtEnd: Date;

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
