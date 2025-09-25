import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';

@Component({
  selector: 'app-test-modal-1',
  imports: [],
  template: `
    <div class="modal-body">
      <p>Este es el contenido dinámico en un componente de edición.</p>
      <p>Puedes poner formularios, listas, etc.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" (click)="modalsService.close()">Cancelar</button>
      <button class="btn btn-warning">Editar</button>
    </div>
  `,
})
export class TestModal1 {
  protected readonly modalsService = inject(ModalsService);
}
