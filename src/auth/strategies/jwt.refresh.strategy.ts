import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/utils/token.payload';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    if (payload.type !== 'refresh')
      throw new UnauthorizedException('un authorized');
    return payload;
  }
}
