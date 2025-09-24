import { Component, inject, Input } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';
import { ChatRoom } from '@data/models/chat-room';

@Component({
  selector: 'app-chat-room',
  template: `
    @if (socket && (socket.user.id !== this.authService.currentUser()?.id)) {
    <div class="text-center mb-3">
      <small class="text-muted">Chat de usted con {{ socket.user.name }}...</small>
    </div>
    <ng-template #room></ng-template>
    } 
    @if (!socket) {
    <div class="text-center mb-3">
      <small class="text-muted">Sala difusión...</small>
    </div>
    <ng-template #broadcast></ng-template>
    }
  `,
  host: {
    class: 'offcanvas-body ps-3',
    '[id]': 'socket?.socket',
  },
})
export class ChatRoomView {
  protected readonly authService = inject(AuthService);
  @Input() socket?: ChatRoom;
}
