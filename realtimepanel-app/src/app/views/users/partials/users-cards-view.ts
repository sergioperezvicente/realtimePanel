import {
  Component,
  computed,
  effect,
  inject,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { User } from '@app/data/models/user';
import { UserService } from '@core/services/user';
import { UserCard } from '../components/user-card';
import { NewUserButton } from '../controls/new-user-button';
import { WsService } from '@core/services/ws';

@Component({
  selector: 'app-users-cards-view',
  imports: [UserCard, NewUserButton],
  template: `
    <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
      @for (user of users(); track user.email) {
      <app-card-user [user]="user" />
      }
      <app-new-user-button />
    </div>
  `,
})
export class UsersCardsView {
  private readonly userService = inject(UserService);
  private readonly ws = inject(WsService);

  protected users = signal<User[]>([]);

  status = effect(() => {
    this.ws.dbUpdated();
    this.loadUsers(this.userService.sorted());
  });

  private loadUsers(sorted: boolean): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        console.log('usuarios sin ordenar', users);
        let entries = [...users];
        console.log(
          'Antes de sort:',
          users.length,
          users.map((u) => u.name)
        );
        if (sorted) {
          entries.sort((a, b) => a.name.localeCompare(b.name));
          console.log(
            'Después de sort:',
            entries.length,
            entries.map((u) => u.name)
          );
        }

        this.users.set(entries);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios');
      },
    });
  }
}
