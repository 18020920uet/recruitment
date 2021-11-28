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
  Column,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Gender } from '@Shared/enums/gender';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { CurriculumVitaeSkillRelation } from '@Entities/curriculum-vitae-skill.relation';
import { NationalityEntity } from '@Entities/nationality.entity';
import { LanguageEntity } from '@Entities/language.entity';
import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';
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

  @OneToMany(() => CurriculumVitaeSkillRelation, (curriculumnVitaeSkill) => curriculumnVitaeSkill.cv, { cascade: true })
  @JoinTable({ name: 'curriculum_vitaes_skills' })
  skillRelations: CurriculumVitaeSkillRelation[];

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
  @Column({ name: 'brief_introduce', type: 'varchar', length: 35, default: '' })
  briefIntroduce: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 10000, default: '' })
  introduce: string;

  @AutoMap({ typeFn: () => CurriculumVitaeExperienceEntity })
  @OneToMany(
    () => CurriculumVitaeExperienceEntity,
    (experience) => experience.curriculumnVitae,
    { cascade: true }
  )
  experiences: CurriculumVitaeExperienceEntity[];

  @AutoMap()
  @Column({ default: 0, type: 'real' })
  rate: number;

  @Column({ name: 'uncounted_star', default: 0, type: 'real' })
  uncountedStar: number;

  @Column({ name: 'area_id', nullable: true })
  areaId: number;

  @AutoMap({ typeFn: () => AreaEntity })
  @ManyToOne(() => AreaEntity)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @AutoMap({ typeFn: () => CountryEntity })
  @ManyToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;
}
