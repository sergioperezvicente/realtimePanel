import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialButton } from '../../../shared/controls/material-button';
import { ViewMode } from '@app/data/enums/view-mode';

@Component({
  selector: 'app-section-users-menu',
  imports: [MaterialButton],
  template: `
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
    class: 'd-flex justify-content-end',
  },
})
export class SectionUsersMenu {
  @Output() selected = new EventEmitter<string>();
}
