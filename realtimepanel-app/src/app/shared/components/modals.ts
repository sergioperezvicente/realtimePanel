import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';
import { MaterialButton } from '../controls/material-button';
import { SettingsService } from '@core/services/settings';
import { UserService } from '@core/services/user';

@Component({
  selector: 'app-modals',
  imports: [CommonModule, MaterialButton],
  template: `
    <div class="modal-dialog shadow" [class]="modals.size()">
      <div class="modal-content">
        <div class="modal-header pe-6" [class]="modals.colour()">
          <h4 class="modal-title col">{{ modals.title() }}</h4>
          <div class="modal-buttons mt-2">
            <app-material-button
              icon="help"
              class="me-2"
              [class.d-none]="users.modeUserForm() === 'delete'"
              [class.d-none]="settings.getShowHelpAlways() === true"
              title="Mostrar ayuda"
              (click)="modals.showHelp.set(!modals.showHelp())"
            />
            <app-material-button icon="close" title="Cerrar modal" (click)="modals.close()" />
          </div>
        </div>
        <ng-container [ngComponentOutlet]="modals.component() ?? null"></ng-container>
      </div>
    </div>
  `,
  host: {
    class: 'modal fade shadow',
    tabindex: '-1',
    id: 'modalRoot',
  },
})
export class Modals {
  protected readonly settings = inject(SettingsService);
  protected readonly modals = inject(ModalsService);
  protected readonly users = inject(UserService);
}
