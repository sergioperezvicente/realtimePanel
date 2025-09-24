import { Component, inject } from '@angular/core';
import { BrandButton } from './controls/brand-button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '@core/services/menu';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, BrandButton],
  template: `
    <app-brand-button />
    <nav>
      <ul>
        @for (item of this.menuService.getMenuItems(); track $index) {
        <li
          class="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2 rounded-0 border-0"
          type="button"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <span class="material-symbols-outlined col-lg-3 col-md-12" style="padding: 0">{{
            item.icon
          }}</span>
          <span class="col-lg-9 d-none d-lg-block text-start fw-semibold">{{ item.name }}</span>
        </li>
        }
      </ul>
    </nav>
  `,
  host: {
    class: 'col-lg-3 col-sm-1 d-none d-md-block vh-100 shadow p-0',
    style: 'max-width: 300px',
    'animate.enter': 'fade-in-down'
  },
})
export class Sidebar {
  protected readonly menuService = inject(MenuService);
}
