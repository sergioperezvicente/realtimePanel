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

  private _chatStatus = signal<ChatStatus>(ChatStatus.off);

  public chatStatus = computed(() => this._chatStatus());
  public rooms = computed(() => this.ws.rooms());

  public wsStatusChangedEffect = effect(() => {
    switch (this.ws.status()) {
      case WsStatus.syncronized:
        this._chatStatus.set(ChatStatus.on);
        return;
      case WsStatus.off:
        this._chatStatus.set(ChatStatus.off);
        return;
    }
  });

  // public incomings = signal<MsgIncoming | undefined>(undefined)

  // public wsStatusChangedEffect = effect(() => {
  //   switch (this.ws.status()) {
  //     case WsStatus.syncronized:
  //       this._chatStatus.set(ChatStatus.on);
  //       return;
  //     case WsStatus.off:
  //       this._chatStatus.set(ChatStatus.off);
  //       return;
  //   }
  // });

  // public roomsChangedEffect = effect(()=>{
  //   this.rooms.set(this.ws.rooms())
  // })

  // public incomingMessageEffect = effect(()=>{
  //   this.incomings.set(this.ws.chatIncoming())
  // })
}
