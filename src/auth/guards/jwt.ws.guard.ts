import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService as JWTS, TokenExpiredError } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/utils/token.payload';
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JWTS,
    private readonly configService: ConfigService,
  ) {}
  canActivate(req: ExecutionContextHost) {
    const client = req.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token as string;
    if (!token) {
      throw new WsException('not authorized');
    }
    const decoded = this.jwt.decode(token) as JwtPayload;
    if (decoded.type !== 'access') throw new WsException('Unauthorized');
    client.handshake.auth = { sub: decoded.sub };
    const verified = this.jwt
      .verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      })
      .catch((e) => {
        throw new WsException(
          e instanceof TokenExpiredError ? 'token expired' : 'unexpected error',
        );
      });
    return verified;
  }
}
