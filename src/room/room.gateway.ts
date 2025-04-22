import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Room } from './interfaces/room.interface';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on('room.created', (room: Room) => {
      this.broadcastRoomCreated(room);
    });
  }

  private broadcastRoomCreated(room: Room) {
    this.server.emit('roomCreated', room); 
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.userService.getUser(client.id);
    if (!user) return;

    const room = this.roomService.joinRoom(data.roomId, user);
    if (room) {
      client.join(room.id);
      client.emit('roomJoined', room);
    } else {
      client.emit('error', { message: 'Room not found' });
    }
  }

  @SubscribeMessage('listRooms')
  handleListRooms(@ConnectedSocket() client: Socket) {
    const rooms = this.roomService.getRooms();
    client.emit('roomList', rooms);
  }
}
