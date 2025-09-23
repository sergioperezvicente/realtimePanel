import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'logout-button',
  imports: [],
  template: `logout`,
  host: { 
    class: 'material-symbols-outlined span-btn', 
    type: 'button', 
    title: 'Cerrar sesión',
    '(click)': 'logout()'
  }

})
export class LogoutButton {
  private readonly authService = inject(AuthService)

  protected logout() {
    this.authService.logout()
  }
}
