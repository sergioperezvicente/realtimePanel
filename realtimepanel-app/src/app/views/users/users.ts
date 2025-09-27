import { Component, effect, inject, signal } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';
import { SectionUsersMenu } from './partials/section-users-menu';
import { ViewMode } from '@app/data/enums/view-mode';
import { UsersCardsView } from './partials/users-cards-view';
import { UsersListView } from './partials/users-list-view';

@Component({
  selector: 'users-view',
  imports: [SectionHeader, SectionUsersMenu, UsersCardsView, UsersListView],
  template: `
    <app-section-header [title]="'Usuarios'" />
    <app-section-users-menu (selected)="onSelected($event)" [view]="modeView()" />
      @switch (modeView()) { 
        @case ("card") { <app-users-cards-view /> }
        @case ("list") { <app-users-list-view /> } 
      } 
  `,
})
export class UsersView {
  protected modeView = signal<ViewMode>(ViewMode.card);

  onSelected(mode: string) {
    switch (mode) {
      case 'list':
        this.modeView.set(ViewMode.list);
        break;
      case 'card':
        this.modeView.set(ViewMode.card);
        break;
    }
  }
}
