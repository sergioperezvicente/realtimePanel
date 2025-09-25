import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtPayload } from '../auth/interfaces/jwt-payload';
import { AuthService } from '../auth/auth.service';
import { Room } from './models/room';
import { Logger } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';

const ws = new Logger('WebSocketGateway');
const chat = new Logger('ChatGateway');
const broadcast = new Logger('BroadcastGateway');

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  private rooms: Room[] = [];

  @WebSocketServer() server: Server;

  async handleConnection(client: any, ...args: any[]) {
    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SEED,
        },
      );
      if (!payload) {
        this.server.to(client).emit('not-authorized');
        this.handleDisconnect(client);
        return;
      }
      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        this.server.to(client).emit('disconected');
        this.handleDisconnect(client);
        return;
      }
      this.rooms.push({
        socket: client.id,
        user: user,
      });
      if (this.rooms.length >= 1) {
        ws.warn(`Usuarios Online: ${this.rooms.length}`);
        this.broadcastAll('chat-on', { message: 'Chat habilitado' });
        this.broadcastAll('chat-rooms', { chatrooms: this.rooms });
      } else {
        //this.server.to(client).emit('disconected');
        this.broadcastAll('chat-off', { message: 'Chat deshabilitado' });
        ws.log(`Usuarios Online: ${this.rooms.length}`);
      }
    } catch (error) {
      console.warn(error)
      if (error = TokenExpiredError) {
        this.server.to(client).emit('expired');
      }
      this.server.to(client).emit('not-authorized');
      this.handleDisconnect(client);
    }
  }

  async handleDisconnect(client: any) {
    this.rooms = this.rooms.filter((socket) => socket.socket !== client.id);

    if (this.rooms.length <= 1) {
      ws.log(`Usuarios Online: ${this.rooms.length}`);
      this.broadcastAll('chat-off', { message: 'Chat inabilitado' });
    } else {
      ws.warn(`Usuarios Online: ${this.rooms.length}`);
    }
    this.broadcastAll('chat-rooms', { chatrooms: this.rooms });
  }

  async handleDisconnectUser(user: User) {
    const sessions = this.rooms.filter((room) => room.user.id === user.id);

    sessions.forEach((room: Room) => {
      this.handleDisconnect(room.socket);
    });
  }

  public broadcastAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('chat')
  handleChat(client: any, payload: any) {
    const fromUser = this.rooms
      .filter((r) => r.socket === client.id)
      .map((r) => r.user.email);
    const toUser = this.rooms
      .filter((r) => r.socket === payload.to)
      .map((r) => r.user.email);
    const target = this.rooms.find((u) => u.socket === payload.to);

    chat.log(`Chat-from: ${fromUser} to: ${toUser} => ${payload.message}`);
    if (target) {
      this.server.to(target.socket).emit('chat-incoming', {
        from: client.id,
        message: payload.message,
      });
    } else {
      ws.warn(`Destino no encontrado: ${payload.to}`);
    }
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: any, message: string) {
    const fromUser = this.rooms
      .filter((r) => r.socket === client.id)
      .map((r) => r.user.email);
    broadcast.warn(`Broadcast-from: ${fromUser} => ${message}`);
    this.broadcastAll('broadcast', message);
  }
}
