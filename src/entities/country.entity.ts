import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('countries')
export class CountryEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'emoji', default: '' })
  emoji: string;
}
