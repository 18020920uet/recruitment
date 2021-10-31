import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { AuthenticationService } from '@Modules/authentication/authentication.service';

import { Payload } from '@Shared/responses/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('secret.jwt'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.authenticationService.validateUser(payload.id);
    return user;
  }
}
