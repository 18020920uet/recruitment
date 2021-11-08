import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { mapFrom } from '@automapper/core';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { CurriculumVitaeExperienceEntity } from '@Entities/curriculum-vitae-experience.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';
import { CurriculumVitae } from '@Shared/responses/curriculum-vitae';
import { CurriculumVitaeExperience } from '@Shared/responses/curriculum-vitae-experience';

import { ProfileResponse } from '@Modules/user/dtos/responses';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User);
      mapper.createMap(CurriculumVitaeExperienceEntity, CurriculumVitaeExperience);
      mapper.createMap(CurriculumVitaeEntity, ProfileResponse);
      mapper
        .createMap(CurriculumVitaeEntity, CurriculumVitae)
        .forMember(
          (curriculumVitae) => curriculumVitae.email,
          mapFrom((curriculumVitaeEntity) => curriculumVitaeEntity.user.email),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.firstName,
          mapFrom((curriculumVitaeEntity) => curriculumVitaeEntity.user.firstName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.lastName,
          mapFrom((curriculumVitaeEntity) => curriculumVitaeEntity.user.lastName),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.avatar,
          mapFrom((curriculumVitaeEntity) => curriculumVitaeEntity.user.avatar),
        )
        .forMember(
          (curriculumVitae) => curriculumVitae.experiences,
          mapFrom((curriculumVitaeEntity) => curriculumVitaeEntity.experiences),
        );
    };
  }
}
