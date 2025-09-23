import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService,) {}


  @WebSocketServer() server: Server;

  async handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  async handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }

  public broadcastAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
