import { PrimaryColumn, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { UserEntity } from '@Entities/user.entity';
import { JobEntity } from '@Entities/job.entity';

import { JobEmployeeStatus } from '@Shared/enums/job-employee-status';

@Entity('jobs_employees')
export class JobEmployeeRelation {
  @AutoMap()
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @ManyToOne(() => JobEntity, (job) => job.employeeRelations, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'id' }])
  job: JobEntity;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @AutoMap({ typeFn: () => UserEntity })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  @AutoMap()
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @AutoMap()
  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @AutoMap()
  @Column({ type: 'enum', enum: JobEmployeeStatus, default: JobEmployeeStatus.WORKING, name: 'job_employee_status' })
  jobEmployeeStatus: JobEmployeeStatus;

  @Column({ name: 'editor_id', nullable: true })
  editorId: string;

  @AutoMap({ typeFn: () => UserEntity })
  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'editor_id', referencedColumnName: 'id' }])
  editor: UserEntity;

  @AutoMap()
  @Column({ name: 'wrote_review', type: 'boolean', default: false })
  wroteReview: boolean;

  @AutoMap()
  @Column({ name: 'has_been_review', type: 'boolean', default: false })
  hasBeenReview: boolean;

  @AutoMap()
  @Column({ name: 'salary', type: 'real', default: 0 })
  salary: number;
}
