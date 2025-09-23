import { Component } from '@angular/core';

@Component({
  selector: 'menu-button',
  template: ` menu `,
  host: {
    class: "material-symbols-outlined span-btn",
    type: "button",
    'data-bs-toggle': "offcanvas",
    'data-bs-target': "#offcanvasSidebar",
    'aria-controls': "offcanvasSidebar",
    title: "Mostrar menu",
  },
})
export class MenuButton {}
