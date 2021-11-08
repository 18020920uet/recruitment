import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

// import { Company } from '@Shared/responses/company';
import { User } from '@Shared/responses/user';
import { Role } from '@Shared/enums/role';

export class Review {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  reviewer: User;

  @AutoMap()
  @ApiProperty()
  reviewee: User;

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
