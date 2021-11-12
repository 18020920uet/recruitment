import { Injectable } from '@nestjs/common';

import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class FileService {
  getAvatar(_user: UserEntity): string {
    const host = process.env.HOST;
    if (_user.avatar == '') {
      return host + '/resource/images/avatar.png';
    }
    return `${host}/public/avatars/${_user.avatar}`;
  }

  getCertification(certificationID: string) {
    const host = process.env.HOST;
    return `${host}/public/certifications/${certificationID}`;
  }
}
