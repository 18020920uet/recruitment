import { IsNotEmpty, IsString, MaxLength, Min, Max, IsOptional, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
