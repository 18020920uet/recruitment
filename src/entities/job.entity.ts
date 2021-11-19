import {
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
  Column,
  Entity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BusinessFieldEntity } from './business-field.entity';
import { CompanyEntity } from './company.entity';
import { SkillEntity } from './skill.entity';
import { AreaEntity } from './area.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column()
  salary: number;

  @Column()
  description: string;

  @Column({ default: 0, name: 'min_employees' })
  minEmployees: number;

  @Column({ default: 0, name: 'max_employees' })
  maxEmployees: number;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.AWAIT })
  status: JobStatus;

  @Column({ type: 'enum', enum: JobExperience, default: null, nullable: true, name: 'experience' })
  experience: JobExperience;

  @Column({ type: 'enum', enum: JobWorkMode, default: JobWorkMode.HYBRID, name: 'work_mode' })
  workMode: JobWorkMode;

  @ManyToMany(() => SkillEntity)
  @JoinTable({
      name: 'jobs_skills',
      joinColumn: { name: 'job_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'skill_id' }
  })
  skills: SkillEntity[];

  @ManyToMany(() => BusinessFieldEntity)
  @JoinTable({
    name: 'jobs_business_fields',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_field_id' }
  })
  businessFields: BusinessFieldEntity[];

  @ManyToOne(() => AreaEntity)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'timestamp',name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
