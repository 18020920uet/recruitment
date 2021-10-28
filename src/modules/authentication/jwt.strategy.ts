import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { Payload } from '@Responses/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('secret.jwt'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    console.log(payload);
    return { userId: payload.id, email: payload.email };
  }
}
