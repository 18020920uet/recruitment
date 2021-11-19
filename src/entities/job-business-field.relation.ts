import { PrimaryColumn, Entity } from 'typeorm';

import { JobEntity } from './job.entity';
import { BusinessFieldEntity } from './business-field.entity';

@Entity('jobs_business_fields')
export class JobBusinessFieldRelation {
  @PrimaryColumn({ name: 'job_id' })
  jobId: number;

  @PrimaryColumn({ name: 'business_field_id'})
  businessFieldId: number;
}
