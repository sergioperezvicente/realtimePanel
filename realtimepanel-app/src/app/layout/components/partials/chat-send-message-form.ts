import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatMode } from '@app/data/enums/chat-mode';
import { InputControl } from '@app/shared/controls/input';
import { MaterialButton } from '@app/shared/controls/material-button';
import { WsService } from '@core/services/ws';

@Component({
  selector: 'app-chat-send-message-form',
  imports: [ReactiveFormsModule, InputControl, MaterialButton],
  template: `
    <form
      [formGroup]="messageForm"
      (ngSubmit)="onSubmit()"
      class="d-flex align-items-center p-3 d-inline"
    >
      <app-input formControlName="messageInput" class="col me-2" type="text" label="Mensaje" />
      <app-material-button
        title="Enviar Mensaje"
        icon="send"
        display="5"
        type="submit"
        color="text-warning"
        [disabled]="!messageForm.get('messageInput')?.value"
      />
    </form>
  `,
  host: {
    class: 'offcanvas-footer bg-body-tertiary shadow',
    'animate.enter': 'fade-in-up',
    'animate.leave': 'fade-in-down',
  },
})
export class ChatSendMessageForm {
  @Input() to!: string | undefined;
  @Input() chatMode!: ChatMode;
  @Output() messageSent = new EventEmitter<{ to: string ; message: string }>();

  private readonly fb = inject(FormBuilder);
  private readonly ws = inject(WsService);

  protected messageForm: FormGroup = this.fb.group({
    messageInput: [''],
  });

  onSubmit(): void {
    const message = this.messageForm.get('messageInput')?.value ?? '';
    if (!message) return;

    // Envía por websocket si corresponde
    if (this.to !== undefined) {
      switch (this.chatMode) {
        case ChatMode.unicast:
          this.ws.send(this.to, message);
          this.messageSent.emit({ to: this.to, message });
          break;
        case ChatMode.broadcast:
          this.ws.sendBroadcast(message);
          this.messageSent.emit({ to: 'broadcast', message });
          break;
      }
    }
    this.messageForm.reset();
  }
}
