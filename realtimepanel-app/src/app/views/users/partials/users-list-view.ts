import { Component, effect, inject, signal } from '@angular/core';
import { User } from '@app/data/models/user';
import { MaterialButton } from '@app/shared/controls/material-button';
import { UserService } from '@core/services/user';
import { WsService } from '@core/services/ws';

@Component({
  selector: 'app-users-list-view',
  imports: [MaterialButton],
  template: `
    <div class="card">
      <div class="card-header text-end">
        <button class="btn btn-theme">Agregar usuario</button>
      </div>
      <div class="card-body p-0">
        <div class="list-group list-group-flush">
          @for (user of users(); track user.id ){
          <div
            type="button"
            class="list-group-item list-group-item-action p-0 d-flex border-0 shadow"
            animate.enter="fade-in-up"
          >
            @if (user.isAdmin) {
            <div class="d-flex align-items-center justify-content-start bg-warning shadow">
              <input
                class="form-check-input display-6 m-0 mx-3"
                type="checkbox"
                value=""
                id="checkDefault"
                animate.enter="pop-appear"
              />
              <div class="fw-semibold pe-3 d-none d-xl-block" style="width: 125px;">
                Administrador
              </div>
            </div>
            } @else {
            <div class="d-flex align-items-center justify-content-start bg-secondary shadow">
              <input
                class="form-check-input display-6 m-0 mx-3"
                type="checkbox"
                value=""
                id="checkDefault"
                animate.enter="pop-appear"
              />
              <div class="fw-semibold pe-3 d-none d-xl-block" style="width: 125px;">Usuario</div>
            </div>
            }

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
                Estado: <span class="badge text-bg-success" animate.enter="fade-in-up">online</span>
                <span class="badge text-bg-danger">offline</span>
              </h6>
              <small><strong>Última conexión:</strong> Hace 3 minutos </small>
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
          </div>
          }
        </div>
      </div>
      <div class="card-footer text-end">Total de usuarios: {{ users().length }}</div>
    </div>
  `,
  styles: ``,
})
export class UsersListView {
  private readonly userService = inject(UserService);
  private readonly ws = inject(WsService);

  protected users = signal<User[]>([]);

  status = effect(() => {
    this.ws.dbUpdated();
    this.loadUsers(this.userService.sorted());
  });

  private loadUsers(sorted: boolean): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        //console.log('usuarios sin ordenar', users);
        let entries = [...users];
        if (sorted) {
          entries.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.users.set(entries);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios');
      },
    });
  }
}
