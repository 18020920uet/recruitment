import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('countries')
export class CountryEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}
