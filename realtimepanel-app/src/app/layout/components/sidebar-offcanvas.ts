import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '@core/services/menu';

@Component({
  selector: 'app-sidebar-offcanvas',
  imports: [RouterLink, RouterLinkActive],
  template: ` <section
      class="btn btn-warning d-flex align-items-center justify-content-center shadow"
      routerLink="/"
      style="border-radius: 0px; min-height: 75px; height: 8vh"
      role="button"
    >
      <h3 class="d-inline">realtime</h3>
      <img
        class="img-fluid"
        src="favicon.svg"
        width="45px"
        style="filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7)); margin: 5px"
      />
      <h3 class="d-inline">panel</h3>
    </section>
    <nav>
      <ul>
        @for (item of this.menuService.getMenuItems(); track $index) {
        <li
          class="btn btn-outline-secondary d-flex align-items-center py-2 rounded-0 border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <span class="material-symbols-outlined col-3" style="padding: 0">{{ item.icon }}</span>
          <span class="col-9 text-start fw-semibold">{{ item.name }}</span>
        </li>
        }
      </ul>
    </nav>`,
  host: {
    class: 'offcanvas offcanvas-start px-0',
    style: 'max-width: 300px;',
    tabindex: '-1',
    id: 'sidebar',
  },
})
export class SidebarOffcanvas {
  protected readonly menuService = inject(MenuService);
}
