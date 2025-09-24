import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message-outgoing',
  template: `
    <div class="text-end mb-1">
      <span
        class="chat-bubble-outgoing badge position-relative text-bg-success shadow fs-6 fw-light text-start text-wrap text-break p-2 pe-5"
        animate.enter="pop-in-from-right"
      >
        {{ message }}
        <small class="position-absolute bottom-0 end-0 text-muted" style="margin-right: 5px">
          {{ createdAt }}
        </small>
      </span>
    </div>
  `,
})
export class ChatMessageOutgoing {
  @Input() message!: string;
  createdAt: string;

  constructor() {
    const now = new Date();
    this.createdAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
