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
import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { CurriculumVitaeExperience } from '@Shared/responses/curriculum-vitae-experience';


import { ProfileResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import { ChangePasswordRequest, UpdateProfileRequest, UpdateCurriculumnVitaeRequest } from './dtos/requests';

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
      relations: ["user"]
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

  async updateCurriculumnVitae(
    _currentUser: UserEntity, updateCurriculumnVitaeRequest: UpdateCurriculumnVitaeRequest
  ): Promise<CurriculumVitae> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ["experiences", "user"]
    });

    await getManager().transaction(async transactionalEntityManager => {
      if (_cv.experiences.length != 0) {
        await transactionalEntityManager.delete(CurriculumVitaeExperienceEntity, _cv.experiences);
      }
      _cv.experiences = [];

      _currentUser.firstName = updateCurriculumnVitaeRequest.firstName;
      _currentUser.lastName = updateCurriculumnVitaeRequest.lastName;
      await transactionalEntityManager.save(_currentUser);

      _cv.phoneNumber = updateCurriculumnVitaeRequest.phoneNumber;
      _cv.minimalHourlyRate = updateCurriculumnVitaeRequest.minimalHourlyRate;
      _cv.skills = updateCurriculumnVitaeRequest.skills;
      _cv.gender = updateCurriculumnVitaeRequest.gender;
      _cv.nationality = updateCurriculumnVitaeRequest.nationality;
      _cv.educations = updateCurriculumnVitaeRequest.educations;
      _cv.certifications = updateCurriculumnVitaeRequest.certifications;
      _cv.languages = updateCurriculumnVitaeRequest.languages;
      _cv.hobbies = updateCurriculumnVitaeRequest.hobbies;
      _cv.introduce = updateCurriculumnVitaeRequest.introduce;

      const _experiences: CurriculumVitaeExperienceEntity[] = [];
      updateCurriculumnVitaeRequest.experiences.forEach((experience: CurriculumVitaeExperience, index: number) => {
        const _experience = new CurriculumVitaeExperienceEntity();
        _experience.companyEmail = experience.companyEmail;
        _experience.companyName = experience.companyName;
        _experience.description = experience.description;
        _experience.startDate = experience.startDate;
        _experience.endDate = experience.endDate;
        _experience.role = experience.role;
        _experience.type = experience.type;
        _experience.index = index;
        _experience.cvId = _cv.id;
        _experiences.push(_experience);
      });

      _cv.experiences = _experiences;
      await transactionalEntityManager.save(_cv);
      await transactionalEntityManager.insert(CurriculumVitaeExperienceEntity, _experiences)
    });

    _cv.user.avatar = this.photoService.getAvatar(_currentUser);
    return await this.mapper.map(_cv, CurriculumVitae, CurriculumVitaeEntity)
  }

  async getCurriculumnVitae(_currentUser: UserEntity): Promise<CurriculumVitae> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ["experiences", "user"]
    });

    _cv.user.avatar = this.photoService.getAvatar(_currentUser);
    return await this.mapper.map(_cv, CurriculumVitae, CurriculumVitaeEntity)
  }

}
