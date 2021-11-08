import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Gender } from '@Shared/enums/gender';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';

import { UserEntity } from '@Entities/user.entity';

@Entity('curriculum-vitaes')
export class CurriculumVitaeEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @AutoMap()
  @Column({ type: 'enum', enum: Gender, default: Gender.UNDEFINED })
  gender: Gender;

  @AutoMap()
  @Column({ nullable: true, type: 'timestamp', default: null, name: 'date_of_birth' })
  dateOfBirth: Date;

  @AutoMap()
  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @AutoMap()
  @Column({ default: null, nullable: true })
  nationality: number;

  @AutoMap()
  @Column({ default: '' })
  address: string;

  @AutoMap()
  @Column({ default: '' })
  skills: string;

  @AutoMap()
  @Column({ default: '' })
  educations: string;

  @AutoMap()
  @Column({ default: '' })
  certifications: string;

  @AutoMap()
  @Column({ default: '' })
  languages: string;

  @AutoMap()
  @Column({ default: '' })
  hobbies: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @AutoMap()
  @Column({ type: 'varchar', length: 500, default: '' })
  introduce: string;

  @AutoMap({ typeFn: () => CurriculumVitaeExperienceEntity })
  @OneToMany(() => CurriculumVitaeExperienceEntity, (experience) => experience.curriculumnVitae)
  experiences: CurriculumVitaeExperienceEntity[];

  @AutoMap()
  @Column({ default: 0, name: 'minimal_hourly_rate' })
  minimalHourlyRate: number;
}
