import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  imports: [],
  template: `
    <div class="text-center mb-3">
      <small class="text-muted">Chat de usted con {{socket}}...</small>
    </div>
    <ng-template #room></ng-template>
  `,
  host: {
    class: 'offcanvas-body ps-3',
    '[id]': 'socket'
  },
})
export class ChatRoomView {
  @Input() socket!: string
}
