import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';
import { MaterialButton } from '../controls/material-button';

@Component({
  selector: 'app-modals',
  imports: [CommonModule, MaterialButton],
  template: `
    <div class="modal-dialog shadow" [class]="ms.size()">
      <div class="modal-content">
        <div class="modal-header pe-6" [class]="ms.colour()">
          <h4 class="modal-title col">{{ ms.title() }}</h4>
          <div class="modal-buttons mt-2">
            <app-material-button icon="help" class="me-2" title="Mostrar ayuda" (click)="ms.showHelp.set(!ms.showHelp())" />
            <app-material-button icon="close" title="Cerrar modal" (click)="ms.close()" />
          </div>
        </div>
        <ng-container [ngComponentOutlet]="ms.component() ?? null" ></ng-container>
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
  protected readonly ms = inject(ModalsService);
}
