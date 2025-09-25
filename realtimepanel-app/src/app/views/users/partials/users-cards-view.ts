import { Component, inject, signal } from '@angular/core';
import { User } from '@app/data/models/user';
import { UserService } from '@core/services/user';
import { UserCard } from '../components/user-card';
import { NewUserButton } from '../controls/new-user-button';

@Component({
  selector: 'app-users-cards-view',
  imports: [UserCard, NewUserButton],
  template: `
  <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
    @for (user of users(); track user.id) {
      <app-card-user [user]="user" />
    }
    <app-new-user-button />
  </div>
  `,
})
export class UsersCardsView {
  private readonly userService = inject(UserService)

  constructor(){
    this.loadUsers()
  }

  protected users = signal<User[]>([]);

  public loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios');
      },
    });
  }
}
