import { animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-footer',
  imports: [],
  template: `
    <p>
      footer works!
    </p>
  `,
  host: {
    class: 'fixed-bottom bg-body-tertiary border-top shadow',
    'animate.enter': 'fade-in-up'
  }
})
export class LoginFooter {

}
