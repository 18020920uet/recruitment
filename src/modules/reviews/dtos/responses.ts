import { ApiProperty } from '@nestjs/swagger';
import { Review } from '@Shared/responses/review';

export class GetReviewsResponse {
  @ApiProperty({ type: [Review] })
  reviews: Review[];

  @ApiProperty()
  totalRecords: number;
}
