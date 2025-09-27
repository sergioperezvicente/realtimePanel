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
      @for (user of users(); track user.id; let i = $index) {
      <app-card-user [user]="user" [style.animation-delay.ms]="i * 50" />
      }
      <app-new-user-button />
    </div>
  `,
})
export class UsersCardsView {
  private readonly us = inject(UserService);
  private readonly ws = inject(WsService);

  protected users = signal<User[]>([]);

  status = effect(() => {
    this.ws.dbUpdated();
    this.us.loadUsers(this.us.sorted()).subscribe((users) => {
      this.users.set(users);
    });
  });
}
