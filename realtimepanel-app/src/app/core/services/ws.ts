import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth';
import { WsStatus } from '@app/data/enums/ws-status';
import { ChatRoom } from '@app/data/models/chat-room';
import { MsgIncoming } from '@app/data/models/msg-incoming';
import { environment } from '@env/environment';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat';
import { ChatStatus } from '@app/data/enums/chat-status';
import { ShellIncoming } from '@app/data/models/shell-incoming';
import { ServerStats } from '@app/data/models/server-stats';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private socket?: Socket;

  private readonly router = inject(Router);

  private readonly _status = signal<WsStatus>(WsStatus.off);
  private readonly _chatStatus = signal<ChatStatus>(ChatStatus.off);
  private readonly _broadcastIncoming = signal<string | undefined>(undefined);
  private readonly _chatIncoming = signal<MsgIncoming | undefined>(undefined);
  private readonly _shellIncoming = signal<ShellIncoming | undefined>(undefined);
  private readonly _serverStats = signal<ServerStats | null>(null)
  

  public status = computed(() => this._status());
  public chatStatus = computed(() => this._chatStatus());
  public broadcastIncoming = computed(() => this._broadcastIncoming());
  public chatIncoming = computed(() => this._chatIncoming());
  public shellIncoming = computed(() => this._shellIncoming());
  public serverStats = computed(() => this._serverStats())
  public dbUpdated = signal<string | undefined>(undefined)

  public rooms = signal<ChatRoom[]>([]);

  public connect(token: string) {
    if (this.socket?.connected) return;
    this.socket = io(`${environment.apiUrl}`, {
      transports: ['websocket'],
      auth: { token },
    });
    this.socket.on('connect', () => {
      this._status.set(WsStatus.syncronized);
    });
    this.socket.on('not-authorized', () => {
      this._status.set(WsStatus.off);
      this.router.navigate(['/auth/login']);
    });
    this.socket.on('expired', () => {
      this._status.set(WsStatus.expired);
      this.router.navigate(['/auth/login']);
      console.warn('expired');
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('Socket desconectado', reason);
      this._status.set(WsStatus.off);
    });

    this.socket.on('chat-on', (data) => {
      this._chatStatus.set(ChatStatus.on);
    });

    this.socket.on('chat-off', (data) => {
      this._chatStatus.set(ChatStatus.off);
    });

    this.socket.on('chat-rooms', (data) => {
      //console.warn(data)
      this.rooms.set(data.chatrooms);
    });

    this.socket.on('chat-incoming', (data) => {
      this._chatIncoming.set(data);
    });

    this.socket.on('broadcast', (message) => {
      //console.log(message);
      this._broadcastIncoming.set(message);
    });

    this.socket.on('db:updated:', (data) => {
      this.dbUpdated.set(data);
      console.warn(data);
    });

    this.socket.on('server-stats', (stats) => {
      this._serverStats.set(stats)
      //console.warn(stats)
    })

    this.socket.on('api:shell:', (data) => {
      this._shellIncoming.set(data)
      //console.warn(data);
    })
  }

  public send(to: string, message: string) {
    const data = { to, message };
    //console.log('chat:', data);
    this.socket?.emit('chat', data);
  }

  public sendBroadcast(message: string) {
    this.socket?.emit('broadcast', message);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
      this._status.set(WsStatus.off);
    }
  }
}
