import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { WsGateway } from './ws.gateway';
import { JwtPayload } from '../auth/interfaces/jwt-payload';
import { AuthService } from '../auth/auth.service';
import { Room } from './models/room';
import { Server, Socket } from 'socket.io';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

const ws = new Logger('WebSocketService');

let rooms: Room[] = [];

@Injectable()
export class WsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  private server: Server;

  async createConection(client: any) {
    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SEED,
        },
      );
      if (!payload) {
        this.server.to(client).emit('not-authorized');
        this.disconnect(client);
        return;
      }
      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        this.server.to(client).emit('disconected');
        this.disconnect(client);
        return;
      }
      rooms.push({
        socket: client.id,
        user: user,
        connected: new Date(),
        disconnected: user.offline ?? new Date()
      });
      ws.log(`Chat-Rooms: added client ${user.email}`);
      if (rooms.length >= 1) {
        ws.warn(`connections: ${rooms.length}`);
        this.server.emit('chat-on', { message: 'Chat habilitado' });
      } else {
        this.server.emit('chat-off', {
          message: 'Chat deshabilitado',
        });
        ws.log(`connections: ${rooms.length}`);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        ws.warn(`token-expired: ${client.id}`);
        this.server.to(client).emit('expired');
      } else {
        ws.error(`unauthorized: ${client.id} - error: ${error}`);
        this.server.to(client).emit('not-authorized');
        this.disconnect(client);
      }
    }
    this.server.emit('chat-rooms', { chatrooms: rooms });
    this.publishDBUpdated('Database ready!');
  }

  disconnect(client: any) {
    // const user = await this.authService.findUserById(client.payload);
    // if (user) {
    //   await this.authService.setOfflineTime(user.id)
    // }
    rooms = rooms.filter((socket) => socket.socket !== client.id);
    if (rooms.length < 1) {
      this.server.emit('chat-off', { message: 'Chat inabilitado' });
      ws.log(`connections: ${rooms.length}`);
    } else {
      this.server.emit('chat-on', { message: 'Chat habilitado' });
      ws.warn(`connections: ${rooms.length}`);
    }
    this.server.emit('chat-rooms', { chatrooms: rooms });
  }

  handleDisconnectUser(user: User) {
    const sessions = rooms.filter((room) => room.user.id === user.id);

    sessions.forEach((room: Room) => {
      this.disconnect(room.socket);
    });
  }

  identify(socket: Socket): any {
    const user = rooms
      .filter((r) => r.socket === socket.id)
      .map((r) => r.user.email);
    return user;
  }

  emit(event: string, data: any) {
    this.server.emit(event, data);
  }

  find(socket: Socket): any {
    const id = rooms.find((r) => r.socket === socket.id);
    return id;
  }

  findAll() {
    return `This action returns all ws`;
  }

  publishDBUpdated(payload: any) {
    this.server.emit('db:updated:', payload);
  }

  //   findOne(id: number) {
  //     return `This action returns a #${id} w`;
  //   }

  //   update(id: number, updateWDto: UpdateWDto) {
  //     return `This action updates a #${id} w`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} w`;
  //   }
}
