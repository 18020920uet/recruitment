import { PrimaryColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('areas')
export class AreaEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'country_id' })
  countryId: number;

  @ApiProperty()
  @Column()
  name: string;
}
