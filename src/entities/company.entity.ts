import {
  Entity, PrimaryGeneratedColumn, Column,
  JoinColumn, OneToOne, ManyToOne,
  ManyToMany, JoinTable, OneToMany
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CompanyInformationEntity } from './company-information.entity';
import { BusinessFieldEntity } from './business-field.entity';
import { CountryEntity } from './country.entity';
import { AreaEntity } from './area.entity';
import { UserEntity } from './user.entity';
import { JobEntity } from './job.entity';

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

  @Column({ default: '' })
  email: string;

  @AutoMap()
  @Column()
  isVerified: boolean;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @AutoMap()
  @ManyToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @AutoMap({ typeFn: () => AreaEntity })
  @ManyToOne(() => AreaEntity)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @AutoMap({ typeFn: () => CompanyInformationEntity })
  @OneToOne(() => CompanyInformationEntity, { cascade: true } )
  @JoinColumn({ name: 'company_information_id' })
  information: CompanyInformationEntity;

  @ManyToMany(() => BusinessFieldEntity , { cascade: true })
  @JoinTable({
    name: 'companies_business_fields',
    joinColumn: { name: "company_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "business_field_id" }
  })
  businessFields: BusinessFieldEntity[];

  @OneToMany(() => JobEntity, job => job.company, { cascade: true })
  jobs: JobEntity[];
}
