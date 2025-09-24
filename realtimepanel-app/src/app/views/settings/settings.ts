import { Component, inject } from '@angular/core';
import { AlertColor } from '@app/data/enums/alert-color';
import { AlertsService } from '@core/services/alerts';

@Component({
  selector: 'settings-view',
  imports: [],
  template: `
    <p>
      settings works!
    </p>
    <button (click)="mostraralerta()">mostrar mensaje</button>
  `,
  styles: ``
})
export class SettingsView {
  private readonly alertService = inject(AlertsService)

  mostraralerta(){
    this.alertService.showAlert('hola que tal', AlertColor.primary)
  }
}
