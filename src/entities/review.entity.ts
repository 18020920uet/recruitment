import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { UserEntity } from '@Entities/user.entity';
import { JobEntity } from '@Entities/job.entity';

import { ReviewBy } from '@Shared/enums/review-by';

@Entity('reviews')
export class ReviewEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap(({ typeFn: () => UserEntity }))
  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'reviewer_id', referencedColumnName: 'id' }])
  reviewer: UserEntity;

  @AutoMap()
  @Column({ name: 'reviewer_id' })
  reviewerId: string;

  @AutoMap(({ typeFn: () => UserEntity }))
  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'reviewee_id', referencedColumnName: 'id' }])
  reviewee: UserEntity;

  @AutoMap()
  @Column({ name: 'reviewee_id', nullable: true })
  revieweeId: string;

  @AutoMap()
  @Column('varchar', { length: 5000 })
  comment: string;

  @AutoMap()
  @Column('real')
  rate: number;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
  updatedAt: Date | null;

  @AutoMap()
  @Column({ name: 'review_by', enum: ReviewBy, default: ReviewBy.FREELANCE })
  reviewBy: ReviewBy;

  @Column({ name: 'job_id' })
  jobId: number;
  @ManyToOne(() => JobEntity, (job) => job.reviews, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'job_id', referencedColumnName: 'id' }])
  job: JobEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
