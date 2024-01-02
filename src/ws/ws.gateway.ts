import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { Server } from 'http';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly wsService: WsService) {}
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('a client connect');
  }

  handleDisconnect() {
    console.log('a client disconnected');
  }
  @SubscribeMessage('hello')
  onMessage() {
    console.log('a client say hello');
    this.server.emit('hi');
  }
}
