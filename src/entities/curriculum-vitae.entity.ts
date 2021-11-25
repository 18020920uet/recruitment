import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  OneToOne,
  Entity,
  Column
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Gender } from '@Shared/enums/gender';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { SkillEntity } from '@Entities/skill.entity';
import { UserEntity } from '@Entities/user.entity';

@Entity('curriculum_vitaes')
export class CurriculumVitaeEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @Column({ type: 'enum', enum: Gender, default: Gender.UNDEFINED })
  gender: Gender;

  @AutoMap()
  @Column({ nullable: true, type: 'timestamp', default: null, name: 'date_of_birth' })
  dateOfBirth: Date;

  @AutoMap()
  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'nationality_id', nullable: true })
  nationalityId: number | null;

  @ManyToOne(() => NationalityEntity, { nullable: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: NationalityEntity;

  @AutoMap()
  @Column({ default: '' })
  address: string;

  @AutoMap({ typeFn: () => SkillEntity })
  @ManyToMany(() => SkillEntity, { cascade: true })
  @JoinTable({
    name: 'curriculum_vitaes_skills',
    joinColumn: { name: 'cv_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  skills: SkillEntity[];

  @AutoMap()
  @Column({ default: '' })
  educations: string;

  @AutoMap()
  @Column({ default: '' })
  certifications: string;

  @AutoMap({ typeFn: () => LanguageEntity })
  @ManyToMany(() => LanguageEntity, { cascade: true })
  @JoinTable({
    name: 'curriculum_vitaes_languages',
    joinColumn: { name: 'cv_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'language_id' },
  })
  languages: LanguageEntity[];

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
}
