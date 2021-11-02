import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { getManager } from "typeorm";
import * as bcrypt from 'bcrypt';

import { UserRepository } from '@Repositories/user.repository';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';

import { ProfileResponse, ChangePasswordResponse } from './dtos/responses';
import { ChangePasswordRequest } from './dtos/requests';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumnVitaeRepository: CurriculumVitaeRepository,
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) { }

  async getProfile(_currentUser: UserEntity): Promise<ProfileResponse> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ["experiences", "user"]
    });
    return await this.mapper.map(_cv, ProfileResponse, CurriculumVitaeEntity)
  }

  async changePassword(
    _currentUser: UserEntity, changePasswordRequest: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const oldPassword = changePasswordRequest.oldPassword;
    const isMatch = await bcrypt.compare(oldPassword, _currentUser.password);

    if (!isMatch) {
      throw new ForbiddenException('Wrong password');
    }

    const saltOrRounds = this.configService.get<number>('bscryptSlatRounds');

    const newPassword = changePasswordRequest.newPassword;
    const hash = await bcrypt.hash(newPassword, saltOrRounds);
    _currentUser.password = hash;
    await this.userRepository.save(_currentUser);

    const changePasswordResponse = new ChangePasswordResponse();
    changePasswordResponse.status = true;
    return changePasswordResponse;
  }
}
