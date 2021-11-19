import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class Skill {
  @AutoMap()
  @ApiProperty()
  id: number;

  @AutoMap()
  @ApiProperty()
  name: string;
}
