import { Injectable } from '@nestjs/common';

import { CompanyEntity } from '@Entities/company.entity';
import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class FileService {
  getAvatar(_user: UserEntity): string {
    const host = process.env.HOST;
    if (_user.avatar == '') {
      return host + '/resources/images/avatar.png';
    }
    return `${host}/public/avatars/${_user.avatar}`;
  }

  getCertification(certificationId: string) {
    const host = process.env.HOST;
    return `${host}/public/certifications/${certificationId}`;
  }

  getLogo(_company: CompanyEntity) {
    const host = process.env.HOST;
    if (_company.logo == '') {
      return `${host}/resources/images/company-logo.png`;
    }
    return `${host}/public/companies/logos/${_company.logo}`;
  }

  getPhoto(photoId: string) {
    const host = process.env.HOST;
    return `${host}/public/companies/photos/${photoId}`;
  }
}
