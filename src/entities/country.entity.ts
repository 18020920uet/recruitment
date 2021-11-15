import { PrimaryColumn, Column, Entity } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('countries')
export class CountryEntity {
  @AutoMap()
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ name: 'emoji', default: '' })
  emoji: string;
}
