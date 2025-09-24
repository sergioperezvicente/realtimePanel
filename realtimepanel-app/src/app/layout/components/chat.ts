import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  imports: [],
  template: `
    <p>
      chat works!
    </p>
  `,
  host: {
    class: 'offcanvas offcanvas-end p-0',
    'data-bs-scroll': 'true',
    style: 'max-width: 450px',
    tabindex: '-1',
    id: 'chat',
  },
})
export class Chat {

}
