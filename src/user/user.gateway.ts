import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';
import { UserSession } from './interfaces/user.interface';

@WebSocketGateway({ cors: true })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
    console.log('Fuck you: ', client.id)
    return this.userService.getUser(client.id) || 'null';
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
}
