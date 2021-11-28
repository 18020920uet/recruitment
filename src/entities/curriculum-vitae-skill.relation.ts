import { PrimaryColumn, JoinColumn, ManyToOne, Entity, Column } from 'typeorm';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { SkillEntity } from '@Entities/skill.entity';

import { JobExperience } from '@Shared/enums/job-experience';

@Entity('curriculum_vitaes_skills')
export class CurriculumVitaeSkillRelation {
  @PrimaryColumn({ name: 'skill_id' })
  skillId: number;

  @PrimaryColumn({ name: 'cv_id' })
  cvId: number;

  @ManyToOne(() => SkillEntity)
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  skill: SkillEntity | null;

  @ManyToOne(() => CurriculumVitaeEntity, (curriculumnVitae) => curriculumnVitae.skillRelations, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  @JoinColumn([{ name: 'cv_id', referencedColumnName: 'id' }])
  cv: CurriculumVitaeEntity | null;

  @Column({ type: 'enum', enum: JobExperience, default: null, nullable: true, name: 'experience' })
  experience: JobExperience;
}
