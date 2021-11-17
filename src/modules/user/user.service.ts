import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { getManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import fs from 'fs';

import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitaeRepository } from '@Repositories/curriculum-vitae.repository';
import { ReviewRepository } from '@Repositories/review.repository';
import { UserRepository } from '@Repositories/user.repository';

import { CurriculumVitaeExperience } from '@Shared/responses/curriculum-vitae-experience';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { User } from '@Shared/responses/user';

import { FileService } from '@Shared/services/file.service';

import { UpdateCertificationsResponse, ChangePasswordResponse, ChangeAvatarResponse } from './dtos/responses';
import { UpdateCurriculumnVitaeRequest, ChangePasswordRequest } from './dtos/requests';


@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private curriculumnVitaeRepository: CurriculumVitaeRepository,
    private reviewRepository: ReviewRepository,
    private userRepository: UserRepository,
    private configService: ConfigService,
    private fileService: FileService,
  ) {}

  getCurrentUser(_currentUser: UserEntity): User {
    return this.mapper.map(_currentUser, User, UserEntity);
  }

  async changePassword(
    _currentUser: UserEntity,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const oldPassword = changePasswordRequest.oldPassword;
    if (!(await bcrypt.compare(oldPassword, _currentUser.password))) {
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

  async updateAvatar(_currentUser: UserEntity, file: Express.Multer.File): Promise<ChangeAvatarResponse> {
    _currentUser.avatar = file.filename;
    await this.userRepository.save(_currentUser);
    return {
      avatar: this.fileService.getAvatar(_currentUser),
    };
  }

  async updateCurriculumnVitae(
    _currentUser: UserEntity,
    updateCurriculumnVitaeRequest: UpdateCurriculumnVitaeRequest,
  ): Promise<CurriculumVitae> {
    const _cv = await this.curriculumnVitaeRepository.findOne({
      where: { user: _currentUser },
      relations: ['experiences', 'user'],
    });

    await getManager().transaction(async (transactionalEntityManager) => {
      if (_cv.experiences.length != 0) {
        await transactionalEntityManager.delete(CurriculumVitaeExperienceEntity, _cv.experiences);
      }
      _cv.experiences = [];

      _currentUser.firstName = updateCurriculumnVitaeRequest.firstName;
      _currentUser.lastName = updateCurriculumnVitaeRequest.lastName;
      await transactionalEntityManager.save(_currentUser);

      _cv.phoneNumber = updateCurriculumnVitaeRequest.phoneNumber;
      _cv.dateOfBirth = new Date(updateCurriculumnVitaeRequest.dateOfBirth);
      _cv.gender = updateCurriculumnVitaeRequest.gender;
      _cv.nationality = updateCurriculumnVitaeRequest.nationality;
      _cv.educations = updateCurriculumnVitaeRequest.educations;
      _cv.introduce = updateCurriculumnVitaeRequest.introduce;
      _cv.hobbies = updateCurriculumnVitaeRequest.hobbies.join('|');
      _cv.skills = updateCurriculumnVitaeRequest.skills.join('|');
      _cv.languages = updateCurriculumnVitaeRequest.languages.join('|');
      _cv.address = updateCurriculumnVitaeRequest.address;

      const _experiences: CurriculumVitaeExperienceEntity[] = [];
      if (updateCurriculumnVitaeRequest.experiences != null && updateCurriculumnVitaeRequest.experiences.length != 0) {
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
      }
      _cv.experiences = _experiences;
      await transactionalEntityManager.save(_cv);
      await transactionalEntityManager.insert(CurriculumVitaeExperienceEntity, _experiences);
    });
    return await this.mapper.map(_cv, CurriculumVitae, CurriculumVitaeEntity);
  }

  async updateCertifications(
    _currentUser: UserEntity,
    files: Express.Multer.File[],
  ): Promise<UpdateCertificationsResponse> {
    const _cv = await this.curriculumnVitaeRepository.findOne({ where: { user: _currentUser } });
    const _certifications = _cv.certifications.split('|');

    /// Remove old file
    for (const _certification of _certifications) {
      if (_certification != '') {
        const path = `./public/certifications/${_certification}`;
        fs.unlinkSync(path);
      }
    }

    const certifications = files.map((file) => file.filename);
    _cv.certifications = certifications.join('|');
    await this.curriculumnVitaeRepository.save(_cv);
    return {
      certifications: _cv.certifications.split('|').map((_c) => this.fileService.getCertification(_c)),
    };
  }
}
