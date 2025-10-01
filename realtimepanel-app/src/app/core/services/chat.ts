import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ChatRoom } from '@app/data/models/chat-room';
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

  checkStatus(user: User | undefined): string {
    if (user) {
      const isOnline = this.ws.rooms().some((room) => room.user.id === user.id);
      return isOnline ? 'online' : 'offline';
    }
    return 'offline';
  }

  timeByUser(user: User): Date {
    const room = this.ws.rooms().find((r) => r.user.id === user.id);

    if (!room) return user.offline!;

    if (room?.connected) {
      return new Date(room?.connected);
    }
    return new Date();
  }
}
