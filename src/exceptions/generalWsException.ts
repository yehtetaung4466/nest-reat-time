import {
  Catch,
  WsExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class GeneralWsException implements WsExceptionFilter {
  catch(exception: WsException | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient() as Socket;
    if (exception instanceof HttpException) {
      client.emit('error', exception.getResponse());
    } else if (exception instanceof WsException) {
      client.emit('error', exception.message);
    } else {
      client.emit('error', exception.message || 'internal server error');
    }
  }
}
