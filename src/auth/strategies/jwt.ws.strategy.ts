import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/utils/token.payload';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'jwt-ws') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async authenticate(req: any) {
    // console.log(req);
    super.authenticate(req);
    // super.authenticate()
  }
  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') throw new WsException('un authorized');
    return payload;
  }
}
