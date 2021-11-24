import { PrimaryColumn, Column, Entity, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { BusinessFieldEntity } from './business-field.entity';
import { JobEntity } from './job.entity';

@Entity('skills')
export class SkillEntity {
  @AutoMap()
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => BusinessFieldEntity)
  @JoinTable({
    name: 'business_fields_skills',
    joinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'business_field_id' },
  })
  businessFields: BusinessFieldEntity[];

  @ManyToMany(() => JobEntity)
  @JoinTable({
    name: 'jobs_skills',
    joinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'job_id' },
  })
  jobs: JobEntity[];
}
