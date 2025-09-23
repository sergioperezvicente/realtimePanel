import { computed, Injectable, signal } from '@angular/core';
import { AlertColor } from '@app/data/enums/alert-color';
import { Alert } from '@app/data/models/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private _alert = signal<Alert | undefined>(undefined);

  public alert = computed(()=> this._alert())

  public showAlert(message: string, color: AlertColor) {
    this._alert.set({ message, color });
    setTimeout(() => this.clearAlert(), 3000);
  }

  private clearAlert(): void {
    this._alert.set(undefined);
  }
}
