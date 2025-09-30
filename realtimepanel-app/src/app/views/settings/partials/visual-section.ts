import { Component, inject, OnDestroy } from '@angular/core';
import { CheckControl } from '@app/shared/controls/check';
import { SettingsService } from '@core/services/settings';

@Component({
  selector: 'app-settings-visual',
  imports: [CheckControl],
  template: `
    <div class="d-flex display-8 align-items-center mb-3" animate.enter="pop-appear">
      <input
        class="d-inline m-0 p-0"
        type="color"
        id="colorInput"
        [value]="settings.getRgbColorTheme()"
        (input)="applyColor($event)"
        style="width: 26px;"
      />
      <label class="d-block ps-3" for="colorInput">Seleccione un color para el tema</label>
    </div>

    <app-check
      display="display-8"
      label="Mostrar la ayuda disponible siempre"
      [value]="settings.getShowHelpAlways()"
      (changed)="settings.setShowHelpAlways($event)"
    />
  `,
})
export class VisualSection implements OnDestroy {
  protected readonly settings = inject(SettingsService);

  protected applyColor(event: Event) {
    const hex = (event.target as HTMLInputElement).value;
    this.settings.setRgbColorTheme(hex);
  }

  ngOnDestroy(): void {
    this.settings.saveSettingsOnDB()
  }
}
