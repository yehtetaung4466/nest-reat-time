import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { ExtractJwt } from 'passport-jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(req: ExecutionContextHost) {
    const client = req.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token as string;
    if (!token) {
      throw new WsException('not authorized');
      // client.emit('error', 'not authorized');
      // return false;
    } else {
      return true;
    }
  }
}
