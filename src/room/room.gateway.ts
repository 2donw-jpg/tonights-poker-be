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
import { UserSession } from 'src/user/interfaces/user.interface';

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

  notifyUserJoined(roomId: string, user: UserSession) {
    this.server.to(roomId).emit('userJoined', user);
  }

  private broadcastRoomCreated(room: Room) {
    this.server.emit('roomCreated', room); 
  }


  @SubscribeMessage('listRooms')
  handleListRooms(@ConnectedSocket() client: Socket) {
    const rooms = this.roomService.getRooms();
    client.emit('roomList', rooms);
  }
}
