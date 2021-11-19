import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class BusinessField {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  name: string;
}
