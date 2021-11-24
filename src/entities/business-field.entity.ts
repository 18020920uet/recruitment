import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { SkillEntity } from './skill.entity';

@Entity('business_fields')
export class BusinessFieldEntity {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @ManyToMany(() => SkillEntity)
  @JoinTable({
    name: 'business_fields_skills',
    joinColumn: { name: 'business_field_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  skill: SkillEntity[];
}
