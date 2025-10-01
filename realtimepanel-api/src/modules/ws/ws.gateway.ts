import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';

const chat = new Logger('ChatGateway');
const broadcast = new Logger('BroadcastGateway');

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => WsService))
    private readonly wsService: WsService,
  ) {}

  afterInit(server: any) {
    setInterval(async () => {
      const stats = await this.wsService.getServerStats();
      this.server.emit('server-stats', stats)
    }, 5000)
  }

  async handleConnection(client: any, ...args: any[]) {
    await this.wsService.createConection(client);
  }

  getActiveClients() {
    return Array.from(this.server.sockets.sockets.values());
  }

  handleDisconnect(client: any) {
    this.wsService.disconnect(client);
  }

  to(client: any, payload: any) {
    this.server.to(client).emit(payload);
  }

  emit(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('chat')
  handleChat(client: Socket, payload: any) {
    const fromUser = this.wsService.identify(client);
    const toUser = this.wsService.identify(payload.to);
    chat.log(`Chat-from: ${fromUser} to: ${toUser} => ${payload.message}`);
    this.server.to(payload.to).emit('chat-incoming', {
      from: client.id,
      message: payload.message,
    });
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: any, message: string) {
    const fromUser = this.wsService.identify(client);
    broadcast.warn(`Broadcast-from: ${fromUser} => ${message}`);
    this.emit('broadcast', message);
  }
}
