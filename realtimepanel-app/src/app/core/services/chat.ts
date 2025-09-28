import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ChatStatus } from '@app/data/enums/chat-status';
import { ChatRoom } from '@app/data/models/chat-room';
import { MsgIncoming } from '@app/data/models/msg-incoming';
import { WsStatus } from '@app/data/enums/ws-status';
import { WsService } from './ws';
import { AuthService } from '@app/auth/services/auth';
import { User } from '@app/data/models/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly ws = inject(WsService);
  private readonly authService = inject(AuthService);

  private _rooms = signal<ChatRoom[]>([]);

  public chatStatus = computed(() => this.ws.chatStatus());

  public broadcast = computed(() => this.ws.broadcastIncoming());
  public incoming = computed(() => this.ws.chatIncoming());

  public rooms = computed(() => this._rooms());

  roomsChangedEffect = effect(() => {
    const rooms = this.ws
      .rooms()
      .filter((room) => room.user.id !== this.authService.currentUser()?.id);
    this._rooms.set(rooms);
  });

  checkStatus(user: User): string {
    const isOnline = this.ws.rooms().some((room) => room.user.id === user.id);
    return isOnline ? 'online' : 'offline';
  }

  timeConnected(room: ChatRoom): number {
    if (!room.connected) return 0;
    const end = room.disconnected ?? new Date();
    return end.getTime() - room.connected.getTime()
  }
}
