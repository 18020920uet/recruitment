import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';

import { CurriculumVitaeEntity } from '@Entities/curriculum-vitae.entity';
import { UserEntity } from '@Entities/user.entity';

import { User } from '@Shared/responses/user';
import { GetProfileResponse } from '@Modules/user/dtos/responses';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User);
      mapper.createMap(CurriculumVitaeEntity, GetProfileResponse);
    };
  }
}
