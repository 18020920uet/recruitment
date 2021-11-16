import { Entity, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CurriculumVitaeExperienceType } from '@Shared/enums/curriculum-vitae-experience-type';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';

@Entity('curriculum_vitaes_experiences')
export class CurriculumVitaeExperienceEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CurriculumVitaeEntity, (curriculumnVitae) => curriculumnVitae.experiences)
  @JoinColumn({ name: 'cv_id' })
  curriculumnVitae: CurriculumVitaeEntity;

  @Column({ name: 'cv_id' })
  cvId: number;

  @AutoMap()
  @Column()
  index: number;

  @AutoMap()
  @Column({ name: 'company_email' })
  companyEmail: string;

  @AutoMap()
  @Column({ name: 'company_name' })
  companyName: string;

  @AutoMap()
  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @AutoMap()
  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @AutoMap()
  @Column()
  role: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column({ type: 'enum', enum: CurriculumVitaeExperienceType })
  type: CurriculumVitaeExperienceType;
}
