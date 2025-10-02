import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ChatRoom } from '@app/data/models/chat-room';
import { WsService } from './ws';
import { AuthService } from '@app/auth/services/auth';
import { User } from '@app/data/models/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly wss = inject(WsService);
  private readonly auths = inject(AuthService);

  private _rooms = signal<ChatRoom[]>([]);
  

  public showed = signal<boolean>(false)  
  public status = computed(() => this.wss.chatStatus());

  public broadcast = computed(() => this.wss.broadcastIncoming());
  public incoming = computed(() => this.wss.chatIncoming());

  public rooms = computed(() => this._rooms());
  public notify = new Audio('assets/sounds/notify.mp3')
  public msg = new Audio('assets/sounds/msg.mp3') 

  constructor() {
    this.notify.load();
    this.msg.load()
  }

  roomsChangedEffect = effect(() => {
    const rooms = this.wss
      .rooms()
      .filter((room) => room.user.id !== this.auths.currentUser()?.id);
    this._rooms.set(rooms);
  });

  checkStatus(user: User | undefined): string {
    if (user) {
      const isOnline = this.wss.rooms().some((room) => room.user.id === user.id);
      return isOnline ? 'online' : 'offline';
    }
    return 'offline';
  }

  timeByUser(user: User): Date {
    const room = this.wss.rooms().find((r) => r.user.id === user.id);

    if (!room) return user.offline!;

    if (room?.connected) {
      return new Date(room?.connected);
    }
    return new Date();
  }
}
