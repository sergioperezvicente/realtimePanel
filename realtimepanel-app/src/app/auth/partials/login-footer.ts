import { Component, inject } from '@angular/core';
import { App } from '@app/app';

@Component({
  selector: 'app-login-footer',
  imports: [],
  template: `
    <div class="row">
      <div class="col-9 text-start">
        <strong
          >Copyright &copy; {{ this.app.year }} · <a href="{{ this.app.website }}">realtimepanel </a>
        </strong>
        <br />
        <small class="text-muted">Todos los derechos reservados</small>
      </div>
      <div class="col-3 align-content-center text-end"><b>Version</b> {{ this.app.version }}</div>
    </div>
  `,
  host: {
    class: 'fixed-bottom bg-body-tertiary border-top p-4 shadow',
    'animate.enter': 'fade-in-up',
  },
})
export class LoginFooter {
  protected readonly app = inject(App);
}
