import { Injectable } from '@nestjs/common';
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';

import { UserEntity } from '@Entities/user.entity';
import { User } from '@Shared/responses/user';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(UserEntity, User);
    };
  }
}
