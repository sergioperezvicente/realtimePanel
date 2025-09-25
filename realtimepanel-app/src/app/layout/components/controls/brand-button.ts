import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-button',
  imports: [],
  template: `<h3 class="d-inline d-none d-lg-block">realtime</h3>
    <img
      class="img-fluid"
      src="favicon.svg"
      width="45px"
      style="filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7)); margin: 5px"
    />
    <h3 class="d-inline d-none d-lg-block">panel</h3>`,
  host: {
    class: 'btn-theme d-flex align-items-center justify-content-center shadow rounded-0',
    role: 'button',
  },
})
export class BrandButton {}
