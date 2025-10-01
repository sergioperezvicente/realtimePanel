import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { WsGateway } from './ws.gateway';
import { JwtPayload } from '../auth/interfaces/jwt-payload';
import { AuthService } from '../auth/auth.service';
import { Room } from './models/room';
import { Socket } from 'socket.io';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as os from 'os';
import checkDiskSpace from 'check-disk-space';

const ws = new Logger('WebSocketService');
const rootPath = os.platform() === 'win32' ? 'C:\\' : '/';

let rooms: Room[] = [];

@Injectable()
export class WsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly server: WsGateway,
    private readonly jwtService: JwtService,
  ) {}

  async createConection(client: any) {
    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(
        client.handshake.auth.token,
        {
          secret: process.env.JWT_SEED,
        },
      );
      if (!payload) {
        this.server.to(client, 'not-authorized');
        this.disconnect(client);
        return;
      }
      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        this.server.to(client, 'disconected');
        this.disconnect(client);
        return;
      }
      rooms.push({
        socket: client.id,
        user: user,
        connected: new Date(),
        disconnected: user.offline ?? new Date(),
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
        this.server.to(client, 'expired');
      } else {
        ws.error(`unauthorized: ${client.id} - error: ${error}`);
        this.server.to(client, 'not-authorized');
        this.disconnect(client);
      }
    }
    this.server.emit('chat-rooms', { chatrooms: rooms });
    this.publishDBUpdated('Database ready!');
  }

  disconnect(client: any) {
    const user = this.identify(client);
    rooms = rooms.filter((socket) => socket.socket !== client.id);
    if (user) {
      ws.log(`Chat-Rooms: removed client ${user}`);
    }
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

  checkStatusUser(userId: string): 'online' | 'offline' {
    const finded = rooms.find((room) => room.user.id === userId);
    if (finded) {
      return 'online';
    }
    return 'offline';
  }

  identify(socket: Socket | string): string | null {
    if (!socket) return null;

    const socketId = typeof socket === 'string' ? socket : socket.id;

    const room = rooms.find((r) => r.socket === socketId);
    return room ? room.user.email : null;
  }

  emit(event: string, data: any) {
    this.server.emit(event, data);
  }

  allConnections(): any {
    return this.server.getActiveClients();
  }

  publishDBUpdated(payload: any) {
    this.server.emit('db:updated:', payload);
  }

  publishConsole(payload: any) {
    this.server.emit('api:shell:', payload);
  }

  async getServerStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const cpuPercent = await this.getCpuUsagePercent();
    const cpus = os.cpus().length;

    const rootPath = os.platform() === 'win32' ? 'C:\\' : '/';
    const disk = await checkDiskSpace(rootPath);

    return {
      uptime: process.uptime(),
      platform: os.platform(),
      release: os.release(),
      connections: rooms.length,
      cpus,
      cpuPercent,
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        percent: (usedMem / totalMem) * 100,
      },
      disk: {
        total: disk.size,
        free: disk.free,
        used: disk.size - disk.free,
        percent: ((disk.size - disk.free) / disk.size) * 100,
      },
    };
  }
  
  private async getCpuUsagePercent(): Promise<number> {
    const start = os.cpus().map((cpu) => ({ ...cpu.times }));

    await new Promise((resolve) => setTimeout(resolve, 100));

    const end = os.cpus().map((cpu) => ({ ...cpu.times }));

    let idleDiff = 0;
    let totalDiff = 0;

    for (let i = 0; i < start.length; i++) {
      const startTotal = Object.values(start[i]).reduce((a, b) => a + b, 0);
      const endTotal = Object.values(end[i]).reduce((a, b) => a + b, 0);

      const idle = end[i].idle - start[i].idle;
      const total = endTotal - startTotal;

      idleDiff += idle;
      totalDiff += total;
    }

    return Math.round(100 - (idleDiff / totalDiff) * 100);
  }
}
