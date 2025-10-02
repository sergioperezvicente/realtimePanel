import { Component, effect, inject, signal } from '@angular/core';
import { SettingsService } from '@core/services/settings';
import { ChatService } from '@core/services/chat';
import { WsService } from '@core/services/ws';

@Component({
  selector: 'chat-button',
  imports: [],
  template: `
    <div
      class="col material-symbols-outlined display-7 span-btn"
      [class.notify]="!chats.showed() && chats.incoming()"
    >
      chat_bubble
    </div>
    @if (chats.rooms().length > 0) {
    <small
      class="fw-bold"
      animate.enter="pop-appear"
      title="Hay {{ chats.rooms().length }} usuarios online"
      >{{ chats.rooms().length }}</small
    >
    }
  `,
  host: {
    class: 'icon-badge',
    '[class.d-none]': 'chats.status() !== "on"',
    type: 'button',
    'data-bs-toggle': 'offcanvas',
    'data-bs-target': '#chat',
    'aria-controls': 'chat',
    '[title]': 'title()',
    '(click)': 'onClick()',
  },
})
export class ChatButton {
  private readonly settings = inject(SettingsService);
  protected readonly chats = inject(ChatService);

  protected title = signal<string>('Mostrar Chat');

  onClick() {
    this.title.set('Mostrar Chat');
    this.chats.showed.set(true);
  }

  onIncommingEffect = effect(() => {
    const incoming = this.chats.incoming();
    const sounds = this.settings.getPlaySounds();
    const showed = this.chats.showed();
    if (incoming && sounds) {
      switch (showed) {
        case true:
          this.title.set('Mostrar chat');
          this.chats.msg.play();
          break;
        case false:
          this.title.set('Tiene nuevos mensajes');
          this.chats.notify.play();
          break;
      }
    }
  });
}
