import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { mapFrom } from '@automapper/core';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { ReviewEntity } from '@Entities/review.entity';
import { UserEntity } from '@Entities/user.entity';

import { CurriculumVitaeExperience } from '@Shared/responses/curriculum-vitae-experience';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { Review } from '@Shared/responses/review';
import { ReviewByUser } from '@Shared/responses/review-by-user';

import { User } from '@Shared/responses/user';

import { FileService } from '@Shared/services/file.service';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper, private fileService: FileService) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User).forMember(
        (user) => user.avatar,
        mapFrom((_user) => this.fileService.getAvatar(_user)),
      );
      mapper.createMap(CurriculumVitaeExperienceEntity, CurriculumVitaeExperience);
      mapper
        .createMap(CurriculumVitaeEntity, CurriculumVitae, { useUndefined: true })
        .forMember(
          (curriculumVitae) => curriculumVitae.email,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.email),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.firstName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.firstName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.lastName,
          mapFrom((_curriculumVitae) => _curriculumVitae.user.lastName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.avatar,
          mapFrom((_curriculumVitae) => this.fileService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.experiences,
          mapFrom((_curriculumVitae) => _curriculumVitae.experiences),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.certifications,
          mapFrom((_curriculumVitae) => {
            return _curriculumVitae.certifications
              .split(',')
              .filter((certification) => certification)
              .map((certification) => this.fileService.getCertification(certification));
          }),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.skills,
          mapFrom((_curriculumVitae) => _curriculumVitae.skills.split(',').filter((skill) => skill)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.hobbies,
          mapFrom((_curriculumVitae) => _curriculumVitae.hobbies.split(',').filter((hobby) => hobby)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.languages,
          mapFrom((_curriculumVitae) => _curriculumVitae.languages.split(',').filter((language) => language)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.dateOfBirth,
          mapFrom((_curriculumVitae) => {
            const dateOfBirth = _curriculumVitae.dateOfBirth ? _curriculumVitae.dateOfBirth : new Date();
            return dateOfBirth.toLocaleDateString('en-Us');
          }),
        );
      mapper.createMap(ReviewEntity, Review);
      mapper.createMap(ReviewEntity, ReviewByUser);
    };
  }
}
