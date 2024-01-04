import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/jwt.ws.guard';
import { GeneralWsException } from 'src/exceptions/generalWsException';
import { MessageDto, RoomDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { MemberService } from 'src/member/member.service';
import { GroupMessageService } from 'src/group-message/group-message.service';

@UsePipes(ValidationPipe)
@UseFilters(GeneralWsException)
@WebSocketGateway({ namespace: 'group-chats' })
export class GroupGateway {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMessageService: GroupMessageService,
    private readonly memberService: MemberService,
  ) {}
  @WebSocketServer()
  server: Socket;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('createMessage')
  async newMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessageDto,
  ) {
    const userId = client.handshake.auth.sub as number;
    const newMessage = await this.groupMessageService.createNewGroupMessage(
      userId,
      payload.groupId,
      payload.message,
    );
    this.server
      .to('room' + newMessage.group_id)
      .emit('groupMessages', { newMessage: newMessage.message });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomDto,
  ) {
    const userId = client.handshake.auth.sub as number;
    const canJoin = await this.memberService.isGroupMember(
      userId,
      payload.groupId,
    );
    if (canJoin) {
      const joinedRoom = 'room' + payload.groupId;
      client.join(joinedRoom);
      const groupMessages = await this.groupMessageService.getAllMessageInGroup(
        payload.groupId,
      );
      this.server.to(joinedRoom).emit('groupMessages', groupMessages);
      return 'joined ' + joinedRoom;
    } else {
      throw new WsException('error at joining room');
    }
  }
}
