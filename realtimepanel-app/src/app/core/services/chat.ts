import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ChatStatus } from '@app/data/enums/chat-status';
import { ChatRoom } from '@app/data/models/chat-room';
import { MsgIncoming } from '@app/data/models/msg-incoming';
import { WsStatus } from '@app/data/enums/ws-status';
import { WsService } from './ws';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly ws = inject(WsService);

  public chatStatus = computed(() => this.ws.chatStatus());
  public rooms = computed(() => this.ws.rooms());
  public broadcast = computed(()=> this.ws.broadcastIncoming())
  public incoming = computed(() => this.ws.chatIncoming())

}
