import { Component, effect, inject, signal } from '@angular/core';
import { User } from '@app/data/models/user';
import { UserService } from '@core/services/user';
import { WsService } from '@core/services/ws';
import { UserListItem } from '../components/user-list-item';
import { ModalsService } from '@core/services/modals';
import { UserForm } from './user-form';
import { ModalSize } from '@app/data/enums/modal-size';
import { ModalColor } from '@app/data/enums/modal-color';

@Component({
  selector: 'app-users-list-view',
  imports: [UserListItem],
  template: `
    <div class="card">
      <div class="card-header px-2 py-3 text-end">
        <button
          class="btn btn-danger me-2"
          [class.d-none]="this.us.multipleSelectedUsers().length === 0"
          (click)="this.us.deleteSelectedUsers()"
        >
          Eliminar seleccionados: {{ this.us.multipleSelectedUsers().length }}
        </button>
        <button class="btn btn-theme" (click)="createUser()">Agregar usuario</button>
      </div>
      <div class="card-body p-0">
        <div class="list-group list-group-flush">
          @for (user of users(); track user.id; let i = $index ){
          <app-list-item-user [user]="user" [index]="$index" [style.animation-delay.ms]="i * 50" />
          }
        </div>
      </div>
      <div class="card-footer text-end">Total de usuarios: {{ users().length }}</div>
    </div>
  `,
  styles: ``,
})
export class UsersListView {
  protected readonly us = inject(UserService);
  private readonly ms = inject(ModalsService);
  private readonly ws = inject(WsService);

  protected users = signal<User[]>([]);

  status = effect(() => {
    this.ws.dbUpdated();
    this.us.loadUsers(this.us.sorted()).subscribe((users) => {
      this.users.set(users);
    });
  });

  protected createUser() {
    this.ms.open('Agregar usuario', UserForm, ModalSize.lg, ModalColor.theme);
  }
}
