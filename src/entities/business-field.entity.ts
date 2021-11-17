import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

import { SkillEntity } from './skill.entity';

@Entity('business_fields')
export class BusinessFieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => SkillEntity)
  @JoinTable({
    name: 'skills_business_fields',
    joinColumn: { name: 'business_field_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id' }
  })
  skill: SkillEntity[];
}
