import { PrimaryColumn, Column, Entity, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BusinessFieldEntity } from './business-field.entity';

@Entity('skills')
export class SkillEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => BusinessFieldEntity)
  @JoinTable({
    name: 'skills_business_fields',
    joinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_field_id' }
  })
  businessFields: BusinessFieldEntity[];
}
