import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';
import { UserSession } from './interfaces/user.interface';

@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const user = this.userService.createUser(client.id);
    client.emit('userInfo', user);
    console.log(`User connected: ${user.name}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = this.userService.getUser(client.id);
    if (user) {
      this.userService.removeUser(client.id);
      console.log(`User disconnected: ${user.name}`);
    }
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ): UserSession | null {
    const user = this.userService.getUser(client.id);
    if (!user) return null;
  
    user.name = data.name || user.name;
    client.emit('userInfo', user);
    return user;
  }

  @SubscribeMessage('getUserInfo')
  handleGetUserInfo(@ConnectedSocket() client: Socket): UserSession | string {
    const user = this.userService.getUser(client.id) || 'null';
    client.emit('userInfo', user);
    return user;
  }

  @SubscribeMessage('updateName')
  handleUpdateName(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ): UserSession | null {
    const user = this.userService.getUser(client.id);
    if (!user) return null;
    user.name = data.name;
    client.emit('userInfo', user);
    return user;
  }

  @SubscribeMessage('listPartipants')
  handleListParticipants(
    @ConnectedSocket() client: Socket,
  ): Map<string, UserSession> | null {
    const users = this.userService.listUsers();
    const usersArray = Array.from(users.values());
    console.log('List of users (server):', usersArray);
    client.emit('participantsList', usersArray);

    return users;
  }
}
