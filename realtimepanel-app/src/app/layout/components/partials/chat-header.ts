import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ChatMode } from '@enums/chat-mode';
import { MaterialButton } from '@app/shared/controls/material-button';
import { ChatRoom } from '@data/models/chat-room';
import { ChatService } from '@core/services/chat';
import { AuthService } from '@app/auth/services/auth';

@Component({
  selector: 'app-chat-header',
  imports: [MaterialButton],
  template: `
    <div class="btn btn-warning shadow rounded-0 d-flex">
      @if (mode === "broadcast") {
      <div
        class="col-10 text-start"
        data-bs-toggle="collapse"
        data-bs-target="#userlist"
        aria-controls="userlist"
      >
        <h4>Difusión</h4>
        <h6 class="mb-0">A todos los usuarios</h6>
        <small class="text-secondary fst-italic"
          >Los mensajes aparecerán en todas las salas de chat</small
        >
      </div>
      } @else {
      <div
        class="col-2 pe-3 align-content-center"
        data-bs-toggle="collapse"
        data-bs-target="#userlist"
        aria-controls="userlist"
      >
        <img class="rounded-circle" width="50px" [src]="selectedRoom()?.user?.imageUrl || '/assets/controls/user-photo.svg'" />
      </div>
      <div
        class="col-6 text-start"
        data-bs-toggle="collapse"
        data-bs-target="#userlist"
        aria-controls="userlist"
      >
        <h4>Chat</h4>
        <h6 class="mb-0">{{selectedRoom()?.user?.name || 'Seleccione usuario...'}}</h6>
        <small class="text-secondary fst-italic">{{selectedRoom()?.user?.job || 'Toque para expandir'}}</small>
      </div>
      }

      <div class="col d-flex justify-content-end align-items-center">
        @if (mode === "unicast") {
        <app-material-button
          icon="campaign"
          title="Difundir mensaje"
          (click)="setModeBroadcast()"
        />
        }
        <app-material-button
          class="d-sm-block d-md-none"
          icon="close"
          title="Cerrar Chat"
          data-bs-dismiss="offcanvas"
        />
      </div>
    </div>
    <div class="collapse shadow" id="userlist">
      <div class="list-group list-group-flush">
        @for (room of this.chatService.rooms(); track room.socket ){
          @if (room.user.id !== this.authService.currentUser()?.id) {
            <div
              type="button"
              class="list-group-item list-group-item-action p-0 d-inline"
              data-bs-toggle="collapse"
              data-bs-target="#userlist"
              aria-controls="userlist"
              (click)="onSelectedRoom(room)"
            >
            <img class="col-2" src="{{ room.user.imageUrl || '/assets/controls/user-photo.svg' }}" />
            <span class="col-10 ms-2">{{ room.user.name + ' ' + room.user.lastName }}</span>
          </div>
          }
        }
      </div>
    </div>
  `,
})
export class ChatHeader {
  @Input() mode!: ChatMode;
  @Output() selected = new EventEmitter<ChatRoom | undefined>();
  @Output() changed = new EventEmitter<ChatMode>();

  protected readonly chatService = inject(ChatService);
  protected readonly authService = inject(AuthService)

  protected selectedRoom = signal<ChatRoom | undefined>(undefined)

  protected onSelectedRoom(room: ChatRoom){
    this.selectedRoom.set(room)
    this.selected.emit(room)
    this.changed.emit(ChatMode.unicast)
  }

  protected setModeBroadcast() {
    this.changed.emit(ChatMode.broadcast);
  }
}
