import {
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  Column,
  Entity,
  Index,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { JobCandidateRelation } from './job-candidate.relation';
import { JobEmployeeRelation } from './job-employee.relation';
import { BusinessFieldEntity } from './business-field.entity';
import { CompanyEntity } from './company.entity';
import { SkillEntity } from './skill.entity';
import { AreaEntity } from './area.entity';
import { UserEntity } from './user.entity';

import { JobExperience } from '@Shared/enums/job-experience';
import { JobWorkMode } from '@Shared/enums/job-work-mode';
import { JobStatus } from '@Shared/enums/job-status';
import { ReviewEntity } from './review.entity';

@Entity('jobs')
export class JobEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id' })
  companyId: string;

  @AutoMap({ typeFn: () => CompanyEntity })
  @ManyToOne(() => CompanyEntity, (company) => company.jobs, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: CompanyEntity;

  @AutoMap()
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @AutoMap()
  @Column({  default: 0 })
  salary: number;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column({ default: 0, name: 'min_employees' })
  minEmployees: number;

  @AutoMap()
  @Column({ default: 0, name: 'max_employees' })
  maxEmployees: number;

  @AutoMap()
  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.AWAIT })
  status: JobStatus;

  @AutoMap()
  @Column({ type: 'enum', enum: JobExperience, default: null, nullable: true, name: 'experience' })
  experience: JobExperience;

  @AutoMap()
  @Column({ type: 'enum', enum: JobWorkMode, default: JobWorkMode.HYBRID, name: 'work_mode' })
  workMode: JobWorkMode;

  @AutoMap({ typeFn: () => SkillEntity })
  @ManyToMany(() => SkillEntity, { cascade: true })
  @JoinTable({
    name: 'jobs_skills',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  skills: SkillEntity[];

  @AutoMap({ typeFn: () => BusinessFieldEntity })
  @ManyToMany(() => BusinessFieldEntity, { cascade: true })
  @JoinTable({
    name: 'jobs_business_fields',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_field_id' },
  })
  businessFields: BusinessFieldEntity[];

  @Column({ name: 'creator_id', nullable: true })
  creatorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @Column({ name: 'last_updater_id', nullable: true })
  updaterId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'last_updater_id' })
  lastUpdater: UserEntity;

  @Column({ name: 'area_id' })
  areaId: number;

  @AutoMap()
  @ManyToOne(() => AreaEntity)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @AutoMap()
  @Column({ type: 'date' })
  startDate: string;

  @AutoMap()
  @Column({ type: 'date' })
  endDate: string;

  @AutoMap()
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @AutoMap()
  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => JobEmployeeRelation, (_jobEmployeeRelation) => _jobEmployeeRelation.job, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  employeeRelations: JobEmployeeRelation[];

  @OneToMany(() => JobCandidateRelation, (_jobCandidateRelation) => _jobCandidateRelation.job, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  candidateRelations: JobCandidateRelation[];

  @OneToMany(() => ReviewEntity, (_review) => _review.job)
  reviews: ReviewEntity[];
}
