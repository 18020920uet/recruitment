import { EntityRepository, Repository } from 'typeorm';

import { JobEntity } from '@Entities/job.entity';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {}
