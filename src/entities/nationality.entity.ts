import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('nationalities')
export class NationalityEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;
}
