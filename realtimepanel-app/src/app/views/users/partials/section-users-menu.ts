import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { UserService } from '@core/services/user';
import { MaterialButton } from '@shared/controls/material-button';

@Component({
  selector: 'app-section-users-menu',
  imports: [MaterialButton],
  template: `
    <app-material-button
      class="me-2"
      [class.d-none]="view === 'card'"
      icon="checklist"
      display="7"
      [color]="checkColor()"
      title="Selección múltiple"
      (click)="onPressedCheck()"
    />
    <app-material-button
      class="me-2"
      icon="sort_by_alpha"
      display="7"
      [color]="sortedColor()"
      title="Órden alfabético"
      (click)="onPressedSort()"
    />
    <app-material-button
      class="me-2"
      icon="id_card"
      display="6"
      [color]="cardPressed()"
      title="Vista tarjeta"
      (click)="onSelectedView('card')"
    />
    <app-material-button
      icon="format_list_bulleted"
      display="6"
      [color]="listPressed()"
      title="Vista lista"
      (click)="onSelectedView('list')"
    />
  `,
  host: {
    class: 'd-flex justify-content-end align-items-center my-2',
  },
})
export class SectionUsersMenu {
  @Input() view!: 'card' | 'list';
  @Output() selected = new EventEmitter<string>();

  private readonly userService = inject(UserService);

  protected sortedColor = signal<'text-theme' | 'text-secondary'>('text-secondary');
  protected sortedPressed = signal<boolean>(false);
  protected checkColor = signal<'text-theme' | 'text-secondary'>('text-secondary');
  protected checkPressed = signal<boolean>(false);
  protected cardPressed = signal<'text-theme' | ''>('text-theme');
  protected listPressed = signal<'text-theme' | ''>('');

  onPressedSort() {
    if (!this.sortedPressed()) {
      this.sortedColor.set('text-theme');
      this.sortedPressed.set(true);
      this.userService.setSorted(true);
    } else {
      this.sortedColor.set('text-secondary');
      this.sortedPressed.set(false);
      this.userService.setSorted(false);
    }
  }

  onPressedCheck() {
    if (!this.checkPressed()) {
      this.checkColor.set('text-theme');
      this.checkPressed.set(true);
      this.userService.setMultipleCheck(true);
    } else {
      this.checkColor.set('text-secondary');
      this.checkPressed.set(false);
      this.userService.setMultipleCheck(false);
    }
  }

  onSelectedView(view: 'card' | 'list') {
    switch (view) {
      case 'card':
        this.cardPressed.set('text-theme');
        this.listPressed.set('');
        this.selected.emit('card');
        break;
      case 'list':
        this.cardPressed.set('');
        this.listPressed.set('text-theme');
        this.selected.emit('list');
        break;
    }
  }
}
