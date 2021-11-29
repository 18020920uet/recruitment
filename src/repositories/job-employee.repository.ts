import { EntityRepository, Repository } from 'typeorm';

import { JobEmployeeRelation } from '@Entities/job-employee.relation';

@EntityRepository(JobEmployeeRelation)
export class JobEmployeeRepositoty extends Repository<JobEmployeeRelation> {}
