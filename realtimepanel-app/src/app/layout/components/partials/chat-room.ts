import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '@app/data/models/user';

@Component({
  selector: 'app-chat-room',
  template: `
    @if (!user) {
    <div class="text-center mb-3">
      <small class="text-muted">Sala difusión</small>
    </div>
    } @else {
    <div class="text-center mb-3">
      <small class="text-muted">Hablando con {{ user.name }} ...</small>
    </div>
    }
    <ng-template #room></ng-template>
  `,
  host: {
    class: 'offcanvas-body ps-3',
    '[id]': 'socket'
  },
})
export class ChatRoomView {
  @Input() socket?: string;
  @Input() user?: User;
  @ViewChild('room', { read: ViewContainerRef }) room!: ViewContainerRef;
}
