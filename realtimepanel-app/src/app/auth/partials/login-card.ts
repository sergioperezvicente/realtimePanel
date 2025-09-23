import { Component, inject } from '@angular/core';
import { App } from '../../app';
import { Brand } from '../../shared/brand';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login-card',
  imports: [Brand, LoginForm],
  template: `
    <header class="card-header">
      <app-brand size="80px" />
    </header>

    @if (this.app.status() === 'offline') {
    <section class="card-body">body status app</section>
    } @else {
    <app-login-form header="authApp login form"/>
    }
  `,
  host: {
    class: 'card position-absolute top-50 start-50 translate-middle p-0 shadow',
    style: 'width: 500px',
  },
})
export class LoginCard {
  protected readonly app = inject(App);
}
