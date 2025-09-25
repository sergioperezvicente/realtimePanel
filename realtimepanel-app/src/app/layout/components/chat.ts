import { Component, effect, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { ChatHeader } from './partials/chat-header';
import { ChatRoomView } from './partials/chat-room';
import { ChatSendMessageForm } from './partials/chat-send-message-form';
import { ChatService } from '@core/services/chat';
import { ChatRoom } from '@data/models/chat-room';
import { ChatMode } from '@enums/chat-mode';
import { AuthService } from '@app/auth/services/auth';
import { ChatMessageOutgoing } from './partials/chat-message-outgoing';
import { BroadcastMessageIncoming } from './partials/broadcast-message-incoming';
import { ChatMessageIncoming } from './partials/chat-message-incoming';

@Component({
  selector: 'app-chat',
  imports: [ChatHeader, ChatRoomView, ChatSendMessageForm],
  template: `
    <app-chat-header
      [mode]="chatMode()"
      (selected)="onSelected($event)"
      (changed)="onChangeMode($event)"
    />

    @for (chatroom of this.chat.rooms(); track chatroom.socket) { @if (chatroom.user.id !==
    this.authService.currentUser()?.id) {
    <app-chat-room
      [class.d-none]="chatroom.socket !== selectedRoom()?.socket || chatMode() === 'broadcast'"
      [socket]="chatroom.socket"
      [user]="chatroom.user"
    />
    } }

    <app-chat-room [class.d-none]="chatMode() === 'unicast'" [socket]="'broadcast'" />
    @if (selectedRoom() !== undefined || chatMode() === 'broadcast' ){
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
  @ViewChildren(ChatRoomView) chatRooms!: QueryList<ChatRoomView>;

  protected readonly chat = inject(ChatService);
  protected readonly authService = inject(AuthService);

  protected selectedRoom = signal<ChatRoom | undefined>(undefined);
  protected chatMode = signal<ChatMode>(ChatMode.unicast);

  onSelected(room: ChatRoom | undefined) {
    this.selectedRoom.set(room);
  }

  onChangeMode(mode: ChatMode) {
    this.chatMode.set(mode);
  }

  onMessageSent(event: { to: string; message: string }) {
    switch (event.to) {
      case 'broadcast': {
        const broadcastRoom = this.chatRooms.find((room) => room.socket === 'broadcast');

        if (!broadcastRoom) {
          console.warn('No se encontró el room "broadcast"');
          return;
        }

        const cmpRef = broadcastRoom.room.createComponent(ChatMessageOutgoing);
        cmpRef.instance.message = event.message;
        this.downscroll(broadcastRoom);
        break;
      }

      default: {
        const targetRoom = this.chatRooms.find((room) => room.socket === event.to);

        if (!targetRoom) {
          console.warn(`No se encontró el room "${event.to}"`);
          return;
        }

        const cmpRef = targetRoom.room.createComponent(ChatMessageOutgoing);
        cmpRef.instance.message = event.message;
        this.downscroll(targetRoom);
        break;
      }
    }
  }

  onBroadcastEffect = effect(() => {
    const message = this.chat.broadcast();
    if (!message) return;

    this.chatRooms.forEach((room) => {
      room.room.createComponent(BroadcastMessageIncoming).instance.message = message;
      this.downscroll(room);
    });
  });

  onIncomingEffect = effect(() => {
    const msgIncoming = this.chat.incoming();
    if (!msgIncoming) return;

    const target = this.chatRooms.find((room) => room.socket === msgIncoming.from);
    if (!target) {
      console.warn(`No se encontró el room "${msgIncoming.from}"`);
      return;
    }
    target.room.createComponent(ChatMessageIncoming).instance.message = msgIncoming.message
    this.downscroll(target)
  });

  private downscroll(room: ChatRoomView) {
    const container = room.elementRef.nativeElement;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }
}
