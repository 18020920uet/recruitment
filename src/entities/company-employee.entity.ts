import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm';

import { CompanyRole } from '@Shared/enums/company-role';

import { CompanyEntity } from './company.entity';
import { UserEntity } from './user.entity';

@Entity('companies_employees')
export class CompanyEmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ name: 'company_id' })
  companyId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => CompanyEntity, (company) => company.employees, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: CompanyEntity;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  @Column({ type: 'enum', enum: CompanyRole, default: CompanyRole.EMPLOYEE })
  role: CompanyRole;
}
