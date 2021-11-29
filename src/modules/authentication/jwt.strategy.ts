import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthenticationService } from '@Modules/authentication/authentication.service';

import { Payload } from '@Shared/responses/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECERT,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.authenticationService.validateUser(payload.id);
    return user;
  }
}
