import { Component, inject } from '@angular/core';
import { App } from '@app/app';
import { AppStatus } from '@shared/app-status';
import { LoginCard } from './partials/login-card';
import { LoginFooter } from './partials/login-footer';

@Component({
  selector: 'app-login',
  imports: [LoginCard, LoginFooter, AppStatus],
  template: `
    <app-login-card />
    <app-login-footer />
    @if (app.status() === 'offline') {
    <app-status />
    }
  `,
  host: {
    class: 'row',
  },
})
export class LoginView {
  protected readonly app = inject(App);
}
