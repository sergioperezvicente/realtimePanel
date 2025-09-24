import { JwtService } from '@nestjs/jwt';
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
    const payload: JwtPayload = this.jwtService.verify<JwtPayload>(
      client.handshake.auth.token,
      {
        secret: process.env.JWT_SEED,
      },
    );
    if (!payload) return;
    const user = await this.authService.findUserById(payload.id);
    if (!user) return;
    this.rooms.push({
      socket: client.id,
      user: user,
    });
    console.log('Usuarios Online:', this.rooms.length);
    if (this.rooms.length > 1) {
      this.broadcastAll('chat-on', { message: 'Chat habilitado' });
      this.broadcastAll('chat-rooms', { chatrooms: this.rooms });
    }
  }

  async handleDisconnect(client: any) {
    this.rooms = this.rooms.filter((socket) => socket.socket !== client.id);
    console.log('Usuarios Online:', this.rooms.length);
    if (this.rooms.length <= 1) {
      this.broadcastAll('chat-off', { message: 'Chat inabilitado' });
    }
    this.broadcastAll('chat-rooms', { chatrooms: this.rooms });
  }

  public broadcastAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('chat')
  handleChat(client: any, payload: any) {
    console.log('Chat-from:', client.id, 'to:', payload.to , 'message: ', payload.message);
    const target = this.rooms.find((u) => u.socket === payload.to);
    if (target) {
      // Enviar solo al socket de destino
      this.server.to(target.socket).emit('chat-incoming', {
        from: client.id,
        message: payload.message,
      });
    } else {
      console.log('Destino no encontrado:', payload.to);
    }
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: any, payload: any) {
    console.log('Difusion de mensaje:', payload, 'from client:', client.id);
    this.broadcastAll('broadcast', payload)
  }
}
