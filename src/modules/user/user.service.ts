import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';

import { UserRepository } from '@Repositories/user.repository';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';

import { GetProfileResponse } from './dtos/responses';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumnVitaeRepository: CurriculumVitaeRepository,
    private userRepository: UserRepository,
  ) { }

  async getProfile(_currentUser: UserEntity): Promise<GetProfileResponse> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ["experiences", "user"]
    });

    return this.mapper.map(_cv, GetProfileResponse, CurriculumVitaeEntity)
  }

}
