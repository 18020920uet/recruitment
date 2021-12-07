import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { Company } from '@Shared/responses/company';
import { SimpleUser } from '@Shared/responses/user';

import { ReviewBy } from '@Shared/enums/review-by';

export class Review {
  @AutoMap()
  jobId: number;

  @AutoMap()
  jobTitle: string;

  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap({ typeFn: () => SimpleUser })
  @ApiProperty()
  reviewer: SimpleUser;

  @AutoMap({ typeFn: () => SimpleUser })
  @ApiProperty()
  reviewee: SimpleUser;

  @AutoMap()
  @ApiProperty()
  reviewBy: ReviewBy;

  @AutoMap()
  @ApiProperty()
  rate: number;

  @AutoMap()
  @ApiProperty()
  comment: string;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  company: Company;
}
