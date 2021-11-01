import {
  Entity,
  Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne,
  Index, JoinColumn, PrimaryGeneratedColumn
} from 'typeorm';

import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';

@Entity('curriculum-vitaes-experiences')
export class CurriculumVitaeExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CurriculumVitaeEntity, curriculumnVitae => curriculumnVitae.experiences)
  @JoinColumn({ name: 'cv_id' })
  curriculumnVitae: CurriculumVitaeEntity;

  @Column()
  index: number;

  @Column({ name: 'company-email' })
  companyEmail: string;

  @Column({ name: 'company-name' })
  companyName: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @Column()
  role: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: CurriculumVitaeExperienceType })
  type: CurriculumVitaeExperienceType;
}
