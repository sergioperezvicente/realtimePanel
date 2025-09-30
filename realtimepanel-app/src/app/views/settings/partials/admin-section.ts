import { Component, inject, OnDestroy } from '@angular/core';
import { CheckControl } from '@app/shared/controls/check';
import { SettingsService } from '@core/services/settings';

@Component({
  selector: 'app-settings-admin',
  imports: [CheckControl],
  template: `
<app-check
      class="mb-3"
      display="display-8"
      label="Mostrar el estado del servidor"
      [value]="settings.getShowServer()"
      (changed)="settings.setShowServer($event)"
    />
  `,
  styles: ``
})
export class AdminSection implements OnDestroy {
  protected readonly settings = inject(SettingsService)

  ngOnDestroy(): void {
    this.settings.saveSettingsOnDB()
  }
}
