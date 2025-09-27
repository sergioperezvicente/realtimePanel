import { animate } from '@angular/animations';
import { Component, inject, Input } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';
import { User } from '@app/data/models/user';
import { MaterialButton } from '@app/shared/controls/material-button';
import { UserService } from '@core/services/user';

@Component({
  selector: 'app-list-item-user',
  imports: [MaterialButton],
  template: `
    <div
      class="d-flex align-items-center justify-content-start shadow"
      [class.bg-warning]="user.isAdmin"
      [class.bg-secondary]="!user.isAdmin"
    >
      <input
        class="form-check-input display-6 mx-3 mt-0"
        [class.d-none]="!this.userService.multipleCheck()"
        [disabled]="this.authService.currentUser()?.id === user.id"
        type="checkbox"
        value=""
        animate.enter="pop-appear"
      />
      <div
        class="fw-semibold pe-3 d-none d-xl-block"
        [class.ms-3]="!this.userService.multipleCheck()"
        style="width: 125px;"
      >
        @if ((this.authService.currentUser()?.id === user.id) ) {
        <strong class="fs-5">Usted</strong>
        } @else { @if (user.isAdmin) { Administrador } @else { Usuario } }
      </div>
    </div>
    <img
      class="d-flex "
      src="{{ user.imageUrl || '/assets/controls/user-photo.svg' }}"
      style="width: 70px;"
    />
    <div class="col-4 col-sm-5 col-md-6 col-lg-6 col-xl-5 bg-body-secondary ps-2">
      <div class="col-12 pt-2 fs-5 text-truncate">
        {{ user.name + ' ' + user.lastName }}
      </div>
      <small class="text-truncate fst-italic text-muted ">{{ user.job }}</small>
    </div>
    <div class="col bg-body-secondary d-xl-block d-xxl-none"></div>
    <div class="col bg-body-tertiary d-none d-xxl-block ps-2 pt-2">
      <h6>
        <span class="badge text-bg-success" animate.enter="fade-in-up">online</span>
        <span class="badge text-bg-danger">offline</span>
      </h6>
      <small class="fst-italic">Hace 3 minutos </small>
    </div>
    <div class="d-inline text-end align-content-center bg-body-tertiary px-2">
      @if(user.phone) {
      <app-material-button
        class="me-2"
        display="7"
        icon="phone_in_talk"
        color="text-success"
        title="Llamar a contacto"
      />
      }
      <app-material-button
        class="me-2"
        display="7"
        icon="mail"
        color="text-light"
        title="Enviar correo a contacto"
      />
      <app-material-button
        class="me-2"
        display="7"
        icon="contact_phone"
        color="text-primary"
        title="Exportar vCard"
      />
      <app-material-button
        class="me-2"
        display="7"
        icon="edit"
        color="text-warning"
        title="Editar"
      />
      <app-material-button icon="delete" display="7" color="text-danger" title="Eliminar" />
    </div>
  `,
  host: {
    class: 'list-group-item list-group-item-action m-0 p-0 d-flex border-0 shadow',
    'animate.enter': 'fade-in-up',
  },
})
export class UsersListItem {
  @Input() user!: User;
  @Input() check?: boolean = false;

  protected readonly authService = inject(AuthService);
  protected readonly userService = inject(UserService);
}
