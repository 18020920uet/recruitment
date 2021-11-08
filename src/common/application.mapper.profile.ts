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
import { User } from '@Shared/responses/user';

import { ProfileResponse } from '@Modules/user/dtos/responses';
import { PhotoService } from '@Shared/services/photo.service';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper, private photoService: PhotoService) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User)
        .forMember(
          (user) => user.avatar,
          mapFrom((_user) => this.photoService.getAvatar(_user))
        );
      // mapper.createMap(UserEntity, Company)
      //   .forMember(
      //     (compnay) => compnay.avatar,
      //     mapFrom((_user) => this.photoService.getAvatar(_user))
      //   );
      mapper.createMap(CurriculumVitaeExperienceEntity, CurriculumVitaeExperience);
      mapper.createMap(CurriculumVitaeEntity, ProfileResponse)
        .forMember(
          (profile) => profile.avatar,
          mapFrom((_curriculumVitae) => this.photoService.getAvatar(_curriculumVitae.user))
        );
      mapper.createMap(CurriculumVitaeEntity, CurriculumVitae)
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
          mapFrom((_curriculumVitae) => this.photoService.getAvatar(_curriculumVitae.user)),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.experiences,
          mapFrom((_curriculumVitae) => _curriculumVitae.experiences),
        );
      mapper.createMap(ReviewEntity, Review);
    };

  }
}
