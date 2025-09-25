import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message-incoming',
  template: `
    <div class="mb-1">
      <span
        class="chat-bubble-incoming badge position-relative text-bg-secondary shadow fs-6 fw-light text-start text-wrap p-2 pe-5"
        animate.enter="pop-in-from-left"
      >
        {{ message }}
        <small class="position-absolute bottom-0 end-0 text-muted" style="margin-right: 5px">
          {{ createdAt }}
        </small>
      </span>
    </div>
  `,
})
export class ChatMessageIncoming {
  @Input() message!: string;
  createdAt: string;

  constructor() {
    const now = new Date();
    this.createdAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
