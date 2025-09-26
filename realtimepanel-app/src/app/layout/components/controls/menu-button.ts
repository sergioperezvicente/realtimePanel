import { Component } from '@angular/core';

@Component({
  selector: 'menu-button',
  template: ` menu `,
  host: {
    class: "material-symbols-outlined display-7 span-btn",
    type: "button",
    'data-bs-toggle': "offcanvas",
    'data-bs-target': "#sidebar",
    'aria-controls': "sidebar",
    title: "Mostrar menu",
  },
})
export class MenuButton {}
