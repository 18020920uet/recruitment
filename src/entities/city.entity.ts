import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('cities')
export class CityEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'state_id' })
  stateId: number;

  @Column()
  name: string;
}
