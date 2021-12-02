import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { UserEntity } from '@Entities/user.entity';

import { GetUsersQuery } from './dtos/requests';
import { GetUsersResponse, FreeLancer } from './dtos/responses';
import { Role } from '@Shared/enums/role';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

@Injectable()
export class AdminService {
  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  async getUsers(userRole: Role, roleParam: Role, getUsersQuery: GetUsersQuery): Promise<GetUsersResponse> {
    if (userRole != 0) {
      throw new HttpException('No permission to access', HttpStatus.FORBIDDEN);
    } else {
      const options = {
        role: roleParam,
        isActivated: getUsersQuery.is_activated,
        isLock: getUsersQuery.is_lock,
      };

      Object.keys(options).forEach((field) => !options[field] && delete options[field]);
      let data: [UserEntity[], number];
      if (roleParam != 1) {
        data = await getConnection()
          .getRepository(UserEntity)
          .createQueryBuilder('user')
          .select([
            'user.id',
            'user.email',
            'user.firstName',
            'user.lastName',
            'user.isActivated',
            'user.isLock',
            'user.avatar',
          ])
          .where("(user.first_name || ' ' || user.last_name) ILIKE :fullName", {
            fullName: `%${getUsersQuery.name || ''}%`,
          })
          .andWhere({ ...options })
          .orderBy({
            [getUsersQuery.order_by ? `user.${getUsersQuery.order_by}` : 'user.firstName']:
              getUsersQuery.sort_by || 'ASC',
          })
          .skip((getUsersQuery.page > 0 ? getUsersQuery.page - 1 : 0) * (getUsersQuery.records || 10))
          .take(getUsersQuery.records || 10)
          .getManyAndCount();
      } else {
        // data  = await this.userRepository.createQueryBuilder(GetUsersResponse,'users')
        // .leftJoinAndSelect("photos", "photo", "photo.userId = user.id")
        // .getMany();
        // let data = await getConnection()
        //   .getRepository(UserEntity)
        //   .createQueryBuilder('user')
        // .leftJoinAndSelect('companies', 'company', 'company.owner_id = users.id')
        // .select([
        //   'users.id',
        //   'users.email',
        //   'users.firstName',
        //   'users.lastName',
        //   'users.isActivated',
        //   'users.isLock',
        //   'users.avatar',
        //   'company.id',
        //   'company.logo',
        //   'company.name',
        //   'company.stars',
        //   'company.email',
        //   'company.isVerified',
        // ])
        // .where("(users.first_name || ' ' || users.last_name) ILIKE :fullName", {
        //   fullName: `%${getUsersQuery.name || ''}%`,
        // })
        // .andWhere({ ...options })
        // .orderBy({
        //   [getUsersQuery.order_by ? `user.${getUsersQuery.order_by}` : 'users.firstName']: getUsersQuery.sort_by || 'ASC',
        // })
        // .skip((getUsersQuery.page > 0 ? getUsersQuery.page - 1 : 0) * (getUsersQuery.records || 10))
        // .take(getUsersQuery.records || 10)
        // .getManyAndCount();
      }

      const [_listUser, totalRecords] = data;
      const response = new GetUsersResponse();
      response.totalRecords = totalRecords;
      response.users = _listUser;
      return response;
    }
  }
}
