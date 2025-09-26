import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { UserService } from '@core/services/user';
import { MaterialButton } from '@shared/controls/material-button';

@Component({
  selector: 'app-section-users-menu',
  imports: [MaterialButton],
  template: `
    <app-material-button
      class="me-2"
      icon="sort_by_alpha"
      display="6"
      [color]="color()"
      title="Órden alfabético"
      (click)="onPressedSort()"
    />
    <app-material-button
      class="me-2"
      icon="id_card"
      display="6"
      title="Vista tarjeta"
      (click)="this.selected.emit('card')"
    />
    <app-material-button
      icon="format_list_bulleted"
      display="6"
      title="Vista lista"
      (click)="this.selected.emit('list')"
    />
  `,
  host: {
    class: 'd-flex justify-content-end my-2',
  },
})
export class SectionUsersMenu {
  @Output() selected = new EventEmitter<string>();

  private readonly userService = inject(UserService)

  protected color = signal<'text-theme' | ''>('')
  protected pressed = signal<boolean>(false)

  onPressedSort(){
    if (!this.pressed()) {
      this.color.set('text-theme')
      this.pressed.set(true)
      this.userService.setSorted(true)
    } else {
      this.color.set('')
      this.pressed.set(false)
      this.userService.setSorted(false)
    }
  }
}
