import {
  Catch,
  WsExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class GeneralWsException implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient() as Socket;
    // throw new WsException('error');
    console.log(exception);
    console.log('handled by wsException');
    client.emit('error', exception.message);
  }
}
