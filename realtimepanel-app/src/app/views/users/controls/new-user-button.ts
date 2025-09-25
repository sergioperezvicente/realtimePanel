import { Component, inject } from '@angular/core';
import { ModalsService } from '@core/services/modals';
import { UserForm } from '../partials/user-form';
import { ModalSize } from '@data/enums/modal-size';

@Component({
  selector: 'new-user-button',
  imports: [],
  template: `
    <div class="row mx-0">
      <div
        class="col-4 px-0"
        style="
          background-image: url('/assets/controls/user-photo.svg');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 5px 0px 0px 0px;
          min-height: 250px;
        "
      ></div>
      <div class="col-8 px-0">
        <div class="card-header" style="border-radius: 0px 5px 0px 0px">
          <h2 class="card-title placeholder-glow">
            <span class="placeholder col-6"></span>
          </h2>
          <h4 class="card-subtitle text-muted placeholder-glow">
            <span class="placeholder col-9"></span>
          </h4>
          <small class="placeholder-glow"><span class="placeholder col-4"></span></small>
        </div>
        <div class="card-body">
          <p class="placeholder-glow"><span class="placeholder col-8"></span></p>
          <p class="placeholder-glow"><span class="placeholder col-5"></span></p>
          <span class="placeholder-glow"><span class="placeholder col-3"></span></span>
        </div>
      </div>
    </div>
    <div class="card-footer h-100"></div>
  `,
  host: {
    class: 'card card-btn shadow position-relative',
    role: 'button',
    '(click)': 'createUser()',
  },
})
export class NewUserButton {
  private readonly modalsService = inject(ModalsService);

  protected createUser() {
    this.modalsService.open('Agregar usuario', UserForm, ModalSize.lg);
  }
}
