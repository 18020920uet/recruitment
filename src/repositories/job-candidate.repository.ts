import { EntityRepository, Repository } from 'typeorm';

import { JobCandidateRelation } from '@Entities/job-candidate.relation';

@EntityRepository(JobCandidateRelation)
export class JobCandidateRepositoty extends Repository<JobCandidateRelation> {}
