import { EntityRepository, Repository } from 'typeorm';

import { ReviewEntity } from '@Entities/review.entity';

@EntityRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> { }
