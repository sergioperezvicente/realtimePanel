import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';

@Component({
  selector: 'app-modals',
  imports: [CommonModule],
  template: `
    <div class="modal-dialog" [ngClass]="modalsService.size()">
      <div class="modal-content">
        <div class="modal-header" [ngClass]="modalsService.colour()">
          <h4 class="modal-title ">{{ modalsService.title() }}</h4>
          <button type="button" class="btn-close" (click)="modalsService.close()"></button>
        </div>
        <ng-container *ngComponentOutlet="modalsService.component() ?? null"></ng-container>
      </div>
    </div>
  `,
  host: {
    class: 'modal fade',
    tabindex: '-1',
    id: 'modalRoot',
  },
})
export class Modals {
  protected readonly modalsService = inject(ModalsService);
}

