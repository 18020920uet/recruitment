import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

import { User } from '@Shared/responses/user';

export class Review {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  reviewer: User;

  @AutoMap()
  @ApiProperty()
  revieweeId: string;

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
