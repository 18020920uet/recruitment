import { ApiProperty } from '@nestjs/swagger';

export class Skill {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
