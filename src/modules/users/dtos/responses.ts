import { User } from '@Shared/responses/user';

import { CountryEntity } from '@Entities/country.entity';
import { AreaEntity } from '@Entities/area.entity';


export class DeleteReviewResponse {
  status: boolean;
}

export class FreeLancer extends User {
  briefIntroduce: string;
  country: CountryEntity;
  arer: AreaEntity;
  rate: number;
}

export class GetUsersResponse {
  users: FreeLancer;
}
