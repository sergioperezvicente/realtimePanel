import { Component } from '@angular/core';

@Component({
  selector: 'app-offcanvas-brand-button',
  imports: [],
  template: `<h3 class="d-inline">admin</h3>
    <img
      class="img-fluid"
      src="favicon.svg"
      width="45px"
      style="filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7)); margin: 5px"
    />
    <h3 class="d-inline">ranges</h3>`,
  host: {
    class: 'btn btn-warning d-flex align-items-center justify-content-center shadow rounded-0',
    RouterLink: '/',
    role: 'button',
  },
})
export class OffcanvasBrandButton {}
