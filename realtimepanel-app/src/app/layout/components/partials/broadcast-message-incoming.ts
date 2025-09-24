import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-broadcast-message-incoming',
  template: `
    <div class="text-center mb-1">
      <span
        class="badge position-relative text-bg-dark shadow fs-6 fw-bold text-center text-wrap text-break p-3 pb-4"
        animate.enter="pop-appear"
      >
        <div class="text-center"><span class="material-symbols-outlined display-5 mb-2">release_alert</span></div>
        {{ message }}
        <br />
        <small class="position-absolute bottom-0 end-0 fw-light text-muted" style="margin-right: 5px; margin-bottom: 3px">
          {{ createdAt }}
        </small>
      </span>
    </div>
  `,
})
export class BroadcastMessageIncoming {
  @Input() message!: string;
  createdAt: string;

  constructor() {
    const now = new Date();
    this.createdAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
