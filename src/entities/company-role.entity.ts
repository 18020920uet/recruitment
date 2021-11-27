import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { CompanyRole } from '@Shared/enums/company-role';

@Entity('companies_roles')
export class CompanyRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: CompanyRole, default: CompanyRole.EMPLOYEE })
  role: CompanyRole;
}
