import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AutoMap } from '@automapper/classes';

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
  @Column()
  firstName: string;

  @AutoMap()
  @Column()
  lastName: string;

  @Column('boolean')
  isActivated: boolean;

  @Column({ nullable: true, type: 'timestamp', default: null })
  lastResetPassword: Date;

  @Column()
  activateCode: string;

  @Column({ nullable: true, type: 'timestamp', default: null })
  activateDate: Date;

  @Column({ nullable: true, default: null })
  resetCode: string;

  @Column()
  isLock: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column()
  loginFailedStrike: number;
}
