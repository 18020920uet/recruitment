import { PrimaryGeneratedColumn, Column, Entity,
  JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { AutoMap } from '@automapper/classes';


import { UserEntity } from '@Entities/user.entity';

@Entity('reviews')
export class ReviewEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: UserEntity;

  @AutoMap()
  @Column('varchar', { length: 500 })
  comment: string;

  @AutoMap()
  @Column('real')
  rate: number;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
