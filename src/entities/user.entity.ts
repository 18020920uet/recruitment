import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Role } from '@Shared/enums/role';
import { CompanyEmployeeEntity } from './company-employee.entity';

@Entity('users')
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  email: string;

  @Column()
  password: string;

  @AutoMap()
  @Column({ name: 'first_name' })
  firstName: string;

  @AutoMap()
  @Column({ name: 'last_name' })
  lastName: string;

  @AutoMap()
  @Column({ type: 'boolean', name: 'is_activated' })
  isActivated: boolean;

  @Column({ nullable: true, type: 'timestamp', default: null, name: 'last_reset_password' })
  lastResetPassword: Date;

  @Column({ name: 'activate_code' })
  activateCode: string;

  @Column({ nullable: true, type: 'timestamp', default: null, name: 'activate_date' })
  activateDate: Date;

  @Column({ nullable: true, default: null, name: 'reset_code' })
  resetCode: string;

  @AutoMap()
  @Column({ name: 'is_lock' })
  isLock: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin: Date;

  @Column({ name: 'login_failed_strike' })
  loginFailedStrike: number;

  @AutoMap()
  @Column({ type: 'enum', enum: Role, default: Role.FREELANCE })
  role: Role;

  @AutoMap()
  @Column({ default: '' })
  avatar: string;

  @OneToOne(() => CompanyEmployeeEntity, (_companyEmployee: CompanyEmployeeEntity) => _companyEmployee.user, {
    cascade: true,
  })
  employeeOfCompany: CompanyEmployeeEntity;

  @Column({ name: 'total_reviews', default: 0 })
  totalReviews: number;

  @Column({ name: 'review_point', default: 0, type: 'real' })
  reviewPoint: number;
}
