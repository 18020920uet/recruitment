import { PrimaryColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

@Entity('areas')
export class AreaEntity {
  @AutoMap()
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @ApiProperty()
  @Column({ name: 'country_id' })
  countryId: number;

  @AutoMap()
  @ApiProperty()
  @Column()
  name: string;
}
