import { Repository } from 'typeorm';
import { UserEntity } from '@Entities/user.entity';
export declare class UserRepository extends Repository<UserEntity> {
    checkEmailExists(email: string): Promise<boolean>;
}
