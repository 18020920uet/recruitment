import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('nationalities')
export class NationalityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
