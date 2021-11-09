import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class FileService {
  constructor() {}

  getAvatar(_user: UserEntity): string {
    const host = process.env.HOST;
    if (_user.avatar == '') {
      return host + '/resource/images/avatar.png';
    }
    return `${host}/public/images/${_user.avatar}`;
  }

  getCertification(certificationID: string) {
    const host = process.env.HOST;
    return `${host}/public/certifications/${certificationID}`;
  }
}
