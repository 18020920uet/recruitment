import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '@Entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    async checkEmailExists(email: string): Promise<boolean> {
      // (user != null => true  )
      // (user = null  => false )
      return await this.findOne({ email: email }) == null;
    }
}
