import { Component, inject } from '@angular/core';
import { ChatService } from '@core/services/chat';

@Component({
  selector: 'chat-button',
  imports: [],
  template: ` <div class="col material-symbols-outlined span-btn">chat_bubble</div>
  <small class="fw-bold">{{this.chat.rooms().length}}</small> `,
  host: {
    class: 'icon-badge',
    '[class.d-none]': 'this.chat.chatStatus() !== "on"',
    type: "button",
    'data-bs-toggle': "offcanvas",
    'data-bs-target': "#offcanvasChat",
    'aria-controls': "offcanvasChat",
    title: "Mostrar chat",
  },
})
export class ChatButton {
  protected readonly chat = inject(ChatService)
}
