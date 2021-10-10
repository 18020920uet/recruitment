import { User } from '@Responses/user';

export class RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
