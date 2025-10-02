import { Component, inject, OnDestroy } from '@angular/core';
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
    <app-check
      class="mb-3"
      display="display-8"
      label="Reproducir sonidos de las notificaciones"
      [value]="settings.getPlaySounds()"
      (changed)="settings.setPlaySounds($event)"
    />
  `,
  styles: ``,
})
export class GeneralSection implements OnDestroy {
  protected readonly settings = inject(SettingsService);

  ngOnDestroy(): void {
    this.settings.saveSettingsOnDB()
  }
}
