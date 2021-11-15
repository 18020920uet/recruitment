import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CompanyInformationEntity } from './company-information.entity';
import { CountryEntity } from './country.entity';
import { UserEntity } from './user.entity';

@Entity('companies')
export class CompanyEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ default: '' })
  logo: string;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ type: 'real' })
  stars: number;

  @AutoMap()
  @Column()
  isVerified: boolean;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @AutoMap({ typeFn: () => CountryEntity })
  @OneToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @AutoMap({ typeFn: () => CompanyInformationEntity })
  @OneToOne(() => CompanyInformationEntity)
  @JoinColumn({ name: 'company_information_id' })
  information: CompanyInformationEntity;

  @AutoMap()
  // Business Fields: PR|HR|IT|HS|....
  @Column({ default: '', name: 'business_fields' })
  businessFields: string;
}
