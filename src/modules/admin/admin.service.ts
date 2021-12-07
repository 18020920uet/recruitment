import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getConnection, ILike, IsNull, Not } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

import { UserEntity } from '@Entities/user.entity';

import { CompanyRepository } from '@Repositories/company.repository';
import { UserRepository } from '@Repositories/user.repository';

import { CompanyEntity } from '@Entities/company.entity';
import { Role } from '@Shared/enums/role';

import { GetUsersQuery, UpdateUserRequest } from './dtos/requests';

import { CompanyOwner, UserInfo, GetUsersResponse } from './dtos/responses';
@Injectable()
export class AdminService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
  ) {}

  async getUsers(userRole: Role, roleParam: Role, getUsersQuery: GetUsersQuery): Promise<GetUsersResponse> {
    if (userRole != Role.ADMIN) {
      throw new HttpException('No permission to access', HttpStatus.FORBIDDEN);
    } else {
      const options = {
        role: roleParam,
        isActivated: getUsersQuery.is_activated,
        isLock: getUsersQuery.is_lock,
      };

      Object.keys(options).forEach((field) => !options[field] && delete options[field]);
      let data: [UserEntity[] | CompanyEntity[], number];
      if (roleParam != Role.COMPANY) {
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
        data = await this.companyRepository.findAndCount({
          relations: ['owner'],
          where: {
            owner: {
              firstName: getUsersQuery.name != undefined ? ILike(`%${getUsersQuery.name}%`) : Not(IsNull()),
              ...options,
            },
          },
        });
      }

      const [_listUser, totalRecords] = data;
      const response = new GetUsersResponse();
      response.totalRecords = totalRecords;
      response.users =
        roleParam == Role.COMPANY
          ? _listUser.map((user: UserEntity | CompanyEntity) => this.mapper.map(user, CompanyOwner, CompanyEntity))
          : _listUser.map((user: UserEntity | CompanyEntity) => this.mapper.map(user, UserInfo, UserEntity));
      return response;
    }
  }

  async updateUser(userRole: Role, updateUserRequest: UpdateUserRequest): Promise<UserInfo> {
    if (userRole != Role.ADMIN) {
      throw new HttpException('No permission to access', HttpStatus.FORBIDDEN);
    } else {
      let _updateRequest = new UpdateUserRequest();
      _updateRequest.isActivated = updateUserRequest.isActivated;
      _updateRequest.isLock = updateUserRequest.isLock;
      const property = await this.userRepository.findOne({
        where: { id: updateUserRequest.id },
      });
      let newUser = await this.userRepository.save({
        ...property,
        ..._updateRequest,
      });
      return this.mapper.map(newUser, UserInfo, UserEntity);
    }
  }
}
