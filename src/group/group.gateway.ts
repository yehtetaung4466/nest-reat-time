import { Req, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/jwt.ws.guard';

@WebSocketGateway({ namespace: 'group-chats' })
export class GroupGateway {
  @WebSocketServer()
  server: Server;

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    throw new WsException('check if WsException work');
    // console.log(client.handshake.query.token);
    console.log(payload);
    this.server.emit('return','something');
  }
}
