import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('countries')
export class CountryEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'total_cities' })
  totalCities: number;

  @Column({ name: 'total_states' })
  totalStates: number;
}
