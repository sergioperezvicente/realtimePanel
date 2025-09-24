import { Component, inject, signal } from '@angular/core';
import { ChatHeader } from './partials/chat-header';
import { ChatRoomView } from './partials/chat-room';
import { ChatSendMessageForm } from './partials/chat-send-message-form';
import { ChatService } from '@core/services/chat';
import { ChatRoom } from '@data/models/chat-room';
import { ChatMode } from '@enums/chat-mode';

@Component({
  selector: 'app-chat',
  imports: [ChatHeader, ChatRoomView, ChatSendMessageForm],
  template: `
    <app-chat-header />
    @if (this.chat.rooms().length > 1){ 
      @for (room of this.chat.rooms(); track room.user.id) {
        <app-chat-room [socket]="room" />
      } 
    }
    @if (chatMode() === "broadcast"){
      <app-chat-room />
    }
    @if (selectedRoom() === undefined && chatMode() === "broadcast" ){
    <app-chat-send-message-form
      [to]="selectedRoom()?.socket"
      [chatMode]="chatMode()"
      (messageSent)="onMessageSent($event)"
    />}
  `,
  host: {
    class: 'offcanvas offcanvas-end p-0',
    'data-bs-scroll': 'true',
    style: 'max-width: 450px',
    tabindex: '-1',
    id: 'chat',
  },
})
export class Chat {
  protected readonly chat = inject(ChatService);

  protected selectedRoom = signal<ChatRoom | undefined>(undefined);
  protected chatMode = signal<ChatMode>(ChatMode.broadcast);

  onMessageSent(event: { to: string | undefined; message: string }) {
    // const userRoom = event.to;
    // if (!userRoom) return;
    // const target = this.rooms
    //   .toArray()
    //   .find((room) => (room.element.nativeElement as HTMLElement).parentElement?.id === event.to);
    // if (!target) return;
    // target.createComponent(ChatMessageOutgoing).instance.message = event.message;
    // this.downscroll(userRoom);
    // this.chat.send(this._userRoom()!.socketId, message);
  }
}
