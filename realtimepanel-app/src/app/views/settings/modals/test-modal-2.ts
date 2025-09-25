import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';

@Component({
  selector: 'app-test-modal-2',
  imports: [],
  template: `
    <div class="modal-body">
      <p>¿Está seguro de eliminar el elemento seleccionado?</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" (click)="modalService.close()">Cancelar</button>
      <button class="btn btn-danger">Eliminar</button>
    </div>
  `,
})
export class TestModal2 {
  protected readonly modalService = inject(ModalsService)
}
