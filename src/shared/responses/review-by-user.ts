import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { User } from '@Shared/responses/user';

export class ReviewByUser {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  reviewee: User;

  @AutoMap()
  @ApiProperty()
  reviewerId: string;

  @AutoMap()
  @ApiProperty()
  rate: number;

  @AutoMap()
  @ApiProperty()
  comment: string;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  updatedAt: Date;
}
