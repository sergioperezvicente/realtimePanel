import { Component, effect, inject, signal } from '@angular/core';
import { User } from '@app/data/models/user';
import { UserService } from '@core/services/user';
import { WsService } from '@core/services/ws';
import { UsersListItem } from "../components/users-list-item";

@Component({
  selector: 'app-users-list-view',
  imports: [UsersListItem],
  template: `
    <div class="card">
      <div class="card-header px-2 py-3 text-end">
        <button class="btn btn-theme">Agregar usuario</button>
      </div>
      <div class="card-body p-0">
        <div class="list-group list-group-flush">
          @for (user of users(); track user.id; let i = $index ){
            <app-list-item-user [user]='user' [check]="this.userService.multipleCheck()" [style.animation-delay.ms]="i * 50" />
          }
        </div>
      </div>
      <div class="card-footer text-end">Total de usuarios: {{ users().length }}</div>
    </div>
  `,
  styles: ``,
})
export class UsersListView {
  protected readonly userService = inject(UserService);
  private readonly ws = inject(WsService);

  protected users = signal<User[]>([]);

  status = effect(() => {
    this.ws.dbUpdated();
    this.loadUsers(this.userService.sorted());
  });

  private loadUsers(sorted: boolean): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        //console.log('usuarios sin ordenar', users);
        let entries = [...users];
        if (sorted) {
          entries.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.users.set(entries);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios');
      },
    });
  }
}
