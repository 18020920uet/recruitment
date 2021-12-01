import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from '@Entities/user.entity';

import rawUsers from './data/raw_users.json';

export class AddUsers1637924248165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(UserEntity);

    let users: UserEntity[] = [];

    for (const rawUser of rawUsers) {
      const _user = new UserEntity();
      _user.firstName = rawUser['firstName'];
      _user.lastName = rawUser['lastName'];
      _user.loginFailedStrike = 0;
      _user.isActivated = true;
      _user.activateCode = '';
      _user.isLock = false;
      _user.resetCode = '';
      _user.password = '';
      _user.email = rawUser['email'];
      users.push(_user);
      if (users.length == 100) {
        await userRepository.save(users);
        users = [];
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(UserEntity);
    await userRepository.delete({ password: '' });
  }
}
