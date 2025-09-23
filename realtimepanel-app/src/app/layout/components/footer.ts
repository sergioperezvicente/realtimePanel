import { Component, inject } from '@angular/core';
import { App } from '@app/app';

@Component({
  selector: 'app-footer',
  template: `
    <div class="row">
      <div class="col-lg-3 col-md-1 col-xl-3 d-none d-md-block" style="max-width: 300px;"></div>
      <div class="col text-start" style="padding-left: 30px;">
        <strong
          >Copyright &copy; {{ this.app.year }} ·
          <a href="{{ this.app.website }}">realtimePanel </a> </strong
        >·
        <small class="text-muted">Todos los derechos reservados</small>
      </div>
      <div class="col-2 d-none d-md-block me-3"><b>Version</b> {{ this.app.version }}</div>
    </div>
  `,
  host: {
    class: 'fixed-bottom z-0 bg-body-tertiary border-top align-content-center',
    'animate.enter': 'fade-in-up',
  },
})
export class Footer {
  protected readonly app = inject(App);
}
