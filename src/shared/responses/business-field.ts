import { ApiProperty } from '@nestjs/swagger';

export class BusinessField {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
