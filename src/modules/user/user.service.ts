import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { getManager } from "typeorm";
import * as bcrypt from 'bcrypt';

import { PhotoService } from '@Shared/services/photo.service';

import { UserRepository } from '@Repositories/user.repository';
import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';

import { ProfileResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import { ChangePasswordRequest, UpdateProfileRequest } from './dtos/requests';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumnVitaeRepository: CurriculumVitaeRepository,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private photoService: PhotoService,
  ) { }

  async getProfile(_currentUser: UserEntity): Promise<ProfileResponse> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ["experiences", "user"]
    });
    const avatar = this.photoService.getAvatar(_cv.user);
    _cv.user.avatar = avatar;
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

  async updateProfile(_currentUser: UserEntity, updateProfileRequest: UpdateProfileRequest): Promise<ProfileResponse> {
    const _cv = await this.curriculumnVitaeRepository.findOne({ where: { user: _currentUser } });

    await getManager().transaction(async transactionalEntityManager => {
      if (_currentUser.email != updateProfileRequest.email) {
        const email = updateProfileRequest.email;
        const userWithEmail = await this.userRepository.find({ email: email });

        if (userWithEmail) {
          throw new ConflictException('Email has been used');
        }

        // TO DO SEND MAIL TO CONFIRM;
      }

      _currentUser.firstName = updateProfileRequest.firstName;
      _currentUser.lastName = updateProfileRequest.lastName;

      _cv.introduce = updateProfileRequest.introduce;
      _cv.minimalHourlyRate = updateProfileRequest.minimalHourlyRate;
      _cv.skills = updateProfileRequest.skills;
      _cv.nationality = updateProfileRequest.nationality;

      await transactionalEntityManager.save(_currentUser);
      await transactionalEntityManager.save(_cv);
    });

    return await this.mapper.map(_cv, ProfileResponse, CurriculumVitaeEntity)
  }

  async updateAvatar(_currentUser: UserEntity, file: Express.Multer.File): Promise<ChangeAvatarResponse> {
    _currentUser.avatar = file.filename;
    await this.userRepository.save(_currentUser);
    return {
      avatar: this.photoService.getAvatar(_currentUser),
    }
  }
}
