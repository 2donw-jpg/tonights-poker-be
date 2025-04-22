// src/gateway/session.gateway.ts
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private sessions = new Map<string, any>();

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const sessionId = client.id;
    this.sessions.set(sessionId, {
      createdAt: Date.now(),
      data: {},
    });
    console.log(`Client connected: ${sessionId}`);
  }

  handleDisconnect(client: Socket) {
    this.sessions.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('storeData')
  handleData(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const session = this.sessions.get(client.id);
    if (session) {
      session.data = { ...session.data, ...data };
    }
  }

  @SubscribeMessage('getData')
  handleGetData(@ConnectedSocket() client: Socket) {
    return this.sessions.get(client.id)?.data || {};
  }
}
