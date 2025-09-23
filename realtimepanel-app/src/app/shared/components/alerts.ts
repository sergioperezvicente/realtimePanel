import { Component, inject, Input } from '@angular/core';
import { AlertColor } from '@app/data/enums/alert-color';
import { AlertsService } from '@core/services/alerts';

@Component({
  selector: 'app-alerts',
  imports: [],
  template: `{{ this.alertService.alert()?.message || message }}`,
  host: {
    class: 'alert shadow fade',
    '[class]': 'this.alertService.alert()?.color',
    '[class.show]': 'this.alertService.alert()',
    'animate.enter': 'pop-in',
  },
})
export class Alerts {
  @Input() color?: AlertColor;
  @Input() message?: string;

  protected readonly alertService = inject(AlertsService)
}
