import { animate } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';

@Component({
  selector: 'user-dropdown',
  imports: [],
  template: `
    
    <span
      class="dropdown material-symbols-outlined display-7 span-btn me-1"
      type="button"
      title="Usuario"
      data-bs-toggle="dropdown"
      >Person</span
    >
    
    <ul class="dropdown-menu" animate.enter="pop-appear">
      <div class="px-3">{{ getGreeting() }} {{ this.as.currentUser()?.name ?? '' }}!</div>
      <li><hr class="dropdown-divider" /></li>
      <!-- <li>
        <div class="dropdown-item d-flex align-items-center" type="button">
          <span class="material-symbols-outlined"> campaign </span>&nbsp; Notificaciones &nbsp;
          <span class="badge text-bg-success rounded-pill">15</span>
        </div>
      </li>
      <li>
        <div class="dropdown-item d-flex align-items-center" type="button">
          <span class="material-symbols-outlined"> task </span>&nbsp; Tareas &nbsp;
          <span class="badge text-bg-warning rounded-pill">6</span>
        </div>
      </li>
      <li>
        <div class="dropdown-item d-flex align-items-center" type="button">
          <span class="material-symbols-outlined"> sms </span>&nbsp; Mensajes &nbsp;
          <span class="badge text-bg-secondary rounded-pill">0</span>
        </div>
      </li>
      <li><hr class="dropdown-divider" /></li> -->
      <li>
        <span class="dropdown-item" type="button" (click)="openModalChangePassword()"
          >Cambiar la contraseña</span
        >
      </li>
    </ul>
  `,
  host: {
    class: 'dropdown dropstart',
  },
})
export class UserDropdown {
  protected readonly as = inject(AuthService)
  
  openModalChangePassword(){}

  protected getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Buenos días, ';
    } else if (hour >= 12 && hour < 18) {
      return 'Buenas tardes, ';
    } else {
      return 'Buenas noches, ';
    }
  }
}
