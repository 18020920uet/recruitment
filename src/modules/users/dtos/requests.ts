import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReviewsQuery {
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ type: 'number' })
  page: number;
}

export class CreateReviewParam {
  @IsString()
  @ApiProperty()
  userId: string;
}

export class UpdateReviewParams {
  @IsString()
  @ApiProperty()
  userId: string;

  @Type(() => Number)
  @Min(0)
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
