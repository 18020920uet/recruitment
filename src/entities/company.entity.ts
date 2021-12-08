import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToMany,
  OneToOne,
  Entity,
  Column,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CompanyInformationEntity } from './company-information.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';
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

  @Column({ name: 'country_id' })
  countryId: number;

  @AutoMap()
  @ManyToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @Column({ name: 'area_id', nullable: true })
  areaId: number;

  @AutoMap({ typeFn: () => AreaEntity })
  @ManyToOne(() => AreaEntity)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @AutoMap({ typeFn: () => CompanyInformationEntity })
  @OneToOne(() => CompanyInformationEntity, { cascade: true })
  @JoinColumn({ name: 'company_information_id' })
  information: CompanyInformationEntity;

  @ManyToMany(() => BusinessFieldEntity, { cascade: true })
  @JoinTable({
    name: 'companies_business_fields',
    joinColumn: { name: 'company_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_field_id' },
  })
  businessFields: BusinessFieldEntity[];

  @OneToMany(() => JobEntity, (job) => job.company, { cascade: true })
  jobs: JobEntity[];

  @AutoMap()
  @Column({ name: 'review_point', type: 'real', default: 0 })
  reviewPoint: number;

  @AutoMap()
  @Column({ name: 'total_reviews', default: 0 })
  totalReviews: number;

  @OneToMany(() => CompanyEmployeeEntity, (employee) => employee.company, { cascade: true })
  employees: CompanyEmployeeEntity[];
}
