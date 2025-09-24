import { Component, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { ChatHeader } from './partials/chat-header';
import { ChatRoomView } from './partials/chat-room';
import { ChatSendMessageForm } from './partials/chat-send-message-form';
import { ChatService } from '@core/services/chat';
import { ChatRoom } from '@data/models/chat-room';
import { ChatMode } from '@enums/chat-mode';
import { AuthService } from '@app/auth/services/auth';
import { ChatMessageOutgoing } from './partials/chat-message-outgoing';

@Component({
  selector: 'app-chat',
  imports: [ChatHeader, ChatRoomView, ChatSendMessageForm, ChatMessageOutgoing],
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

    <app-chat-room [class.d-none]="chatMode() === 'unicast'" [socket]='"broadcast"'/>
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
        const broadcastRoom = this.chatRooms.find((roomCmp) => roomCmp.socket === 'broadcast');

        if (!broadcastRoom) {
          console.warn('No se encontró el room "broadcast"');
          return;
        }

        // Limpia el contenedor si no quieres mensajes acumulados
        // broadcastRoom.room.clear();

        const cmpRef = broadcastRoom.room.createComponent(ChatMessageOutgoing);
        cmpRef.instance.message = event.message;
        break;
      }

      default: {
        // Aquí puedes manejar el caso "unicast"
        // Por ejemplo, buscar por socket == event.to
        const targetRoom = this.chatRooms.find((roomCmp) => roomCmp.socket === event.to);

        if (!targetRoom) {
          console.warn(`No se encontró el room "${event.to}"`);
          return;
        }

        const cmpRef = targetRoom.room.createComponent(ChatMessageOutgoing);
        cmpRef.instance.message = event.message;
        break;
      }
    }
  }

  // onBroadcastEffect = effect(() => {
  //   const message = this.chat.broadcast();
  //   if (!message) return;
  //   console.log(this.rooms);
  //   this.rooms
  //     .toArray()
  //     .forEach(
  //       (room) => (room.createComponent(BroadcastMessageIncoming).instance.message = message)
  //     );
  // });

  // insertBroadcast(message: string) {
  //   const targets = this.rooms?.length;
  //   console.log(targets);
  // }

  // onBroadcastEffect = effect(() => {
  //   const message = this.chat.broadcast();
  //   if (!message) return;

  //   // Arrays paralelos
  //   const containers = this.rooms.toArray();
  //   const elements = this.roomElements.toArray();

  //   // Filtra por los que tienen un padre con id definido
  //   const targets = containers.filter(
  //     (_, i) => elements[i].nativeElement.parentElement?.id !== undefined
  //   );

  //   console.log('targets', targets);

  //   // Crear el componente en cada contenedor filtrado
  //   targets.forEach((container) => {
  //     container.clear();
  //     const cmpRef = container.createComponent(BroadcastMessageIncoming);
  //     cmpRef.instance.message = message;
  //   });
  // });

  private downscroll(room: string) {
    const container = document.getElementById(room);
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }
}
