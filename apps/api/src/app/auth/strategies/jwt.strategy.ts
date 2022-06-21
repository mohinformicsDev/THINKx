import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { environment } from 'apps/api/src/environments/environment';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    this.logger.log(payload, 'payload');
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
