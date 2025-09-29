import { Component, inject } from '@angular/core';
import { CheckControl } from '@app/shared/controls/check';
import { SettingsService } from '@core/services/settings';

@Component({
  selector: 'app-settings-general',
  imports: [CheckControl],
  template: `
    <app-check
      class="mb-3"
      display="display-8"
      label="Habilitar el modo desarrollo"
      [value]="settings.getDeveloperMode()"
      (changed)="settings.setDeveloperMode($event)"
    />
  `,
  styles: ``,
})
export class GeneralSection {
  protected readonly settings = inject(SettingsService);
}
