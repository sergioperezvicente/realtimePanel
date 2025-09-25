import { Component, inject, Input } from '@angular/core';
import { AlertColor } from '@app/data/enums/alert-color';
import { AlertsService } from '@core/services/alerts';

@Component({
  selector: 'app-alerts',
  imports: [],
  template: `{{ this.alertService.alerts()?.message || message }}`,
  host: {
    class: 'alert shadow fade',
    '[class]': 'this.alertService.alerts()?.color || color',
    '[class.show]': 'this.alertService.alerts()',
    'animate.enter': 'pop-appear',
  },
})
export class Alerts {
  @Input() color?: AlertColor;
  @Input() message?: string;

  protected readonly alertService = inject(AlertsService)
}
