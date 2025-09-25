import { Component, signal } from '@angular/core';
import { User } from '@app/data/models/user';

@Component({
  selector: 'app-users-cards-view',
  imports: [],
  template: `
    @for (user of users(); track user.id) {
    <p>users-cards-view works!</p>
    }
  `,
  host: {
    class: 'd-grip gap-3',
    style: 'grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));',
  },
})
export class UsersCardsView {
  protected users = signal<User[]>([]);
}
