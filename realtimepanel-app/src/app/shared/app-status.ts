import { Component, inject } from '@angular/core';
import { App } from '@app/app';

@Component({
  selector: 'app-status',
  template: `
    <div class="spinner-border align-content-center text-warning" role="status"></div>
    <span class="display-6 ms-3"> {{ this.app.status() }} ...</span>
  `,
  host: {
    class: 'modal-backdrop fade show d-flex justify-content-center align-items-center',
  },
})
export class AppStatus {
  protected readonly app = inject(App);
}
