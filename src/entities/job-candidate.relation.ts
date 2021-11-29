import { PrimaryColumn, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { UserEntity } from '@Entities/user.entity';
import { JobEntity } from '@Entities/job.entity';

import { JobApplyStatus } from '@Shared/enums/job-apply-status';

@Entity('jobs_candidates')
export class JobCandidateRelation {
  @AutoMap()
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @ManyToOne(() => JobEntity, (job) => job.candidateRelations, { onDelete: 'CASCADE' })
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
  updatedAt: Date | null;

  @AutoMap()
  @Column({ type: 'enum', enum: JobApplyStatus, default: JobApplyStatus.WAITING, name: 'apply_status' })
  applyStatus: JobApplyStatus;

  @AutoMap()
  @Column({ type: 'varchar', length: 1000, name: 'intorduce_message' })
  introduceMessage: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 1000, name: 'reject_message', default: null, nullable: true })
  rejectMessage: string;

  @Column({ name: 'editor_id', nullable: true })
  editorId: string;

  @AutoMap({ typeFn: () => UserEntity })
  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'editor_id', referencedColumnName: 'id' }])
  editor: UserEntity;
}
