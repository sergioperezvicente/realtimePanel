import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputControl } from '@shared/controls/input';
import { MenuService } from '@core/services/menu';
import { UserService } from '@core/services/user';
import { ModalsService } from '@core/services/modals';
import { AlertsService } from '@core/services/alerts';
import { ModalMode } from '@data/enums/modal-mode';
import { User } from '@data/models/user';
import { UploadService } from '@core/services/uploads';
import { ImageSelector } from '@app/shared/controls/image-selector';
import { passwordMatchValidator } from '@app/shared/validators/password-match';
import { AuthService } from '@app/auth/services/auth';
import { AlertColor } from '@app/data/enums/alert-color';
import { Help } from '@app/shared/components/help';
import { SettingsService } from '@core/services/settings';
import { ChatService } from '@core/services/chat';

@Component({
  imports: [ReactiveFormsModule, InputControl, ImageSelector, Help],
  template: `
    <div class="modal-body">
      <form [formGroup]="userForm">
        @if (chats.checkStatus(users.selectedUser()!) === 'online') {
          <div class="alert alert-danger d-flex align-items-center p-2" role="alert">
            <svg
              class="me-2"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#ea868f"
            >
            <path
              d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.79-48q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z"
            />
          </svg>
            Este usuario se encuentra online. Cualquier cambio repercutirá en su sesión activa.
          </div>
        }
        <h5>Datos de Usuario</h5>
        <hr class="mt-0" />
        <div class="row g-3 mb-3">
          <div class="col-lg-3">
            <app-image-selector
              formControlName="imageUrlInput"
              base="/assets/controls/user-photo.svg"
            />
          </div>
          <div class="col-lg-9">
            @if (modals.showHelp() || settings.getShowHelpAlways()){
              @switch (users.modeUserForm()) {
                @case (undefined) {
                  <app-help
                    text="Establezca datos tales como el nombre, apellidos o el cargo que desempeña el usuario. Toque en la imagen para cargar una fotografia del usuario."
                  />
                }
                @case ('edit') {
                  <app-help
                    text="Edite los datos del usuario. Toque en la imagen para cambiar la fotografia."
                  />
                }
              }
            }
            <div class="row g-2 mb-2">
              <div class="col-lg-4">
                <app-input
                  formControlName="nameInput"
                  label="Nombre"
                  validation="El nombre es requerido y no puede ser menor a 3 caracteres"
                />
              </div>
              <div class="col-lg-8">
                <app-input formControlName="lastNameInput" label="Apellidos" />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <app-input formControlName="jobInput" label="Cargo" />
              </div>
            </div>
          </div>
        </div>
        <h5>Datos de contacto</h5>
        <hr class="mt-0" />
        @if (modals.showHelp() || settings.getShowHelpAlways()){
          @switch (users.modeUserForm()) {
            @case(undefined){
              <app-help
                text="Añada el número de teléfono y establezca la dirección de correo con la que tendrá acceso a esta aplicación"
              />
            }
            @case('edit'){
              <app-help
                text="Cambie el número de teléfono o la cuenta de acceso a la aplicación."
              />
            }
          }
        }
        <div class="row g-2 mb-3">
          <div class="col-lg-3">
            <app-input
              formControlName="phoneInput"
              label="Teléfono"
              validation="El teléfono debe ser formato numérico"
            />
          </div>
          <div class="col-lg-9">
            <app-input
              formControlName="emailInput"
              type="email"
              label="Email"
              validation="El email es requerido y debe ser formato válido"
            />
          </div>
        </div>
        @if (users.modeUserForm() !== 'delete') {
          <h5>Acceso y Permisos</h5>
          <hr class="mt-0" />
          @switch (users.modeUserForm()) {
            @case (undefined) {
              @if ((modals.showHelp() || settings.getShowHelpAlways())){
                <app-help
                  text="Establezca una contraseña segura que proteja la información personal del usuario al dificultar que terceros accedan a
                  sus cuentas o datos sensibles."
                />
              }
              <div class="row g-2 mb-3">
                <div class="col-lg-6">
                  <app-input
                    formControlName="passwordInput"
                    type="password"
                    label="Contraseña"
                    validation="Mínimo 6 caracteres"
                  />
                </div>
                <div class="col-lg-6">
                  <app-input
                    formControlName="repeatPasswordInput"
                    type="password"
                    label="Repita contraseña"
                    validation="Las contraseñas no coinciden"
                  />
                </div>
              </div>
            }
            @case ('edit') {
              @if (chats.checkStatus(users.selectedUser()!) === 'online') {
                <div class="alert alert-warning d-flex align-items-center p-2" role="alert">
                  <svg
                    class="me-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFDA6A"
                  >
                    <path
                      d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.79-48q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z"
                    />
                  </svg>
                  El cambio de contraseña repercutirá en su sesión activa.
                </div>
              }
              @if(users.selectedUser()?.id === authService.currentUser()?.id) {
                <div class="alert alert-warning d-flex align-items-center p-2" role="alert">
                  <svg
                    class="me-2"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFDA6A"
                  >
                    <path
                      d="m48-144 432-720 432 720H48Zm127-72h610L480-724 175-216Zm304.79-48q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM444-384h72v-192h-72v192Zm36-86Z"
                    />
                  </svg>
                  Para cambiar la contraseña utilice el menu usuario
                </div>
              } @else {
                @if ((modals.showHelp() || settings.getShowHelpAlways())){
                  <app-help
                    text="Establezca una nueva contraseña de acceso para el usuario en el caso de que no se acuerde y haya perdido el acceso a la aplicación. Recuérdele que cambie la contraseña para mantener su confidencialidad. 
                    Si no quiere cambiarla déjela en blanco y guarde los cambios."
                  />
                }
                <div class="row g-2 mb-3">
                  <div class="col-lg-6">
                    <app-input
                      formControlName="passwordInput"
                      type="password"
                      label="Contraseña"
                      validation="Mínimo 6 caracteres"
                    />
                  </div>
                  <div class="col-lg-6">
                    <app-input
                      formControlName="repeatPasswordInput"
                      type="password"
                      label="Repita contraseña"
                      validation="Las contraseñas no coinciden"
                    />
                  </div>
                </div>
              }
            }
          }
          @if (modals.showHelp() || settings.getShowHelpAlways()){
          <app-help
            text="Establezca el rol de acceso que tendrá el usuario. Predeterminadamente tendrá acceso a su propia configuración y al panel general."
          />
          }
          <div class="row">
            <div class="col">
              <div class="form-check">
                <input
                  id="isAdminRadio"
                  class="form-check-input"
                  type="radio"
                  name="isAdminRadio"
                  formControlName="isAdminRadio"
                  [value]="true"
                />
                <label class="form-check-label" for="isAdminRadio">
                  Conceder privilegios administrador
                  <strong class="text-warning">(Acceso ilimitado)</strong>
                </label>
              </div>
              <div class="form-check">
                <input
                  id="isUserRadio"
                  class="form-check-input"
                  type="radio"
                  name="isAdminRadio"
                  formControlName="isAdminRadio"
                  [value]="false"
                />
                <label class="form-check-label" for="isUserRadio"> Conceder sólo acceso a: </label>
              </div>
            </div>
          </div>
          @if(userForm.get('isAdminRadio')?.value === false) {
          <section class="row px-5">
            @for (item of access; track item.name) {
            <div class="col-sm-6 col-md-6 col-lg-4 col-xl-3 form-check">
              <input
                [id]="item.name + 'Check'"
                class="form-check-input"
                type="checkbox"
                value=""
                [formControlName]="item.name + 'Check'"
              />
              <label class="form-check-label" [for]="item.name + 'Check'">
                {{ item.name }}
              </label>
            </div>
            }
          </section>
          }
        }
      </form>
    </div>
    <div class="modal-footer">
      @switch (users.modeUserForm()) { @case ('edit') {<button
        class="btn btn-success"
        [disabled]="userForm.invalid"
        (click)="updateUser()"
      >
        Guardar cambios</button
      >} @case ('delete') {<button
        class="btn btn-danger"
        [class.d-none]="matchUser()"
        (click)="deleteUser()"
      >
        Eliminar</button
      >} @default {<button
        class="btn btn-theme"
        [disabled]="userForm.invalid"
        (click)="createUser()"
      >
        Guardar</button
      >} }
    </div>
  `,
})
export class UserForm implements OnDestroy, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly menus = inject(MenuService);
  private readonly alerts = inject(AlertsService);
  private readonly uploads = inject(UploadService);
  protected readonly users = inject(UserService);
  protected readonly modals = inject(ModalsService);
  protected readonly settings = inject(SettingsService);
  protected readonly authService = inject(AuthService);
  protected readonly chats = inject(ChatService)

  protected userForm!: FormGroup;
  protected access: any[] = [];

  constructor() {
    this.access = this.menus.getMenuItems();
    const user = this.users.selectedUser();
    switch (this.users.modeUserForm()) {
      case 'edit':
        this.userForm = this.fb.group(
          {
            nameInput: [user?.name, [Validators.required, Validators.minLength(3)]],
            lastNameInput: [user?.lastName],
            jobInput: [user?.job],
            imageUrlInput: [user?.imageUrl],
            phoneInput: [user?.phone, [Validators.pattern(/^[0-9]*$/)]],
            emailInput: [user?.email, [Validators.required, Validators.email]],
            passwordInput: ['', [Validators.minLength(6)]],
            repeatPasswordInput: ['', [Validators.minLength(6)]],
            isAdminRadio: [user?.isAdmin, [Validators.required]],
          },
          { validators: passwordMatchValidator }
        );
        this.access.forEach((item) => {
          this.userForm.addControl(item.name + 'Check', new FormControl(false));
          this.userForm.get(item.name + 'Check')?.setValue(user?.access.includes(item.route));
        });
        //console.log('modal en modo edición');
        break;
      case 'delete':
        this.userForm = this.fb.group({
          nameInput: [{ value: user?.name, disabled: true }],
          lastNameInput: [{ value: user?.lastName, disabled: true }],
          jobInput: [{ value: user?.job, disabled: true }],
          imageUrlInput: [{ value: user?.imageUrl, disabled: true }],
          phoneInput: [{ value: user?.phone, disabled: true }],
          emailInput: [{ value: user?.email, disabled: true }],
          passwordInput: [{ value: '', disabled: true }],
          repeatPasswordInput: [{ value: '', disabled: true }],
          isAdminRadio: [{ value: '', disabled: true }],
        });
        //console.log('modal en modo eliminación');
        break;
      default:
        this.userForm = this.fb.group(
          {
            nameInput: ['', [Validators.required, Validators.minLength(3)]],
            lastNameInput: [''],
            jobInput: [''],
            imageUrlInput: [''],
            phoneInput: ['', [Validators.pattern(/^[0-9]*$/)]],
            emailInput: ['', [Validators.required, Validators.email]],
            passwordInput: ['', [Validators.required, Validators.minLength(6)]],
            repeatPasswordInput: ['', [Validators.required, Validators.minLength(6)]],
            isAdminRadio: [true, [Validators.required]],
          },
          { validators: passwordMatchValidator }
        );
        this.access.forEach((item) => {
          this.userForm.addControl(item.name + 'Check', new FormControl(false));
        });
        //console.log('modal en modo creación');
        break;
    }
  }

  private async makeUserDto() {
    const user: User = {
      name: this.userForm.get('nameInput')?.value,
      lastName: this.userForm.get('lastNameInput')?.value,
      job: this.userForm.get('jobInput')?.value,
      phone: this.userForm.get('phoneInput')?.value,
      email: this.userForm.get('emailInput')?.value,
      password: this.userForm.get('passwordInput')?.value,
      imageUrl: this.userForm.get('imageUrlInput')?.value,
      isAdmin: false,
      access: [],
    };

    const isAdmin = this.userForm.get('isAdminRadio')?.value;
    if (isAdmin) {
      user.isAdmin = true;
      user.access = ['/'];
    } else {
      user.isAdmin = false;
      user.access = this.access
        .filter((item) => this.userForm.get(item.name + 'Check')?.value)
        .map((item) => item.route);
    }
    //Conceder acceso al dashboard por default
    if (!user.access.includes('/')) {
      user.access.push('/');
    }
    //Conceder acceso a la configuración por default
    if (!user.access.includes('/settings')) {
      user.access.push('/settings');
    }

    //Si hay imagen... subirla
    if (user.imageUrl) {
      const file = await this.uploads.convertBlobToFilePNG(user.imageUrl);
      user.imageUrl = await new Promise<string>((resolve, reject) => {
        this.uploads.uploadImage(file, 'avatars').subscribe({
          next: (res) => resolve(res.filePath),
          error: (err) => {
            console.error('Upload Error:', err);
            reject(err);
          },
        });
      });
    }
    return user;
  }

  protected async createUser(): Promise<void> {
    const user = await this.makeUserDto();
    this.users.createUser(user).subscribe({
      next: (res) => {
        this.alerts.showAlert('Usuario creado correctamente', AlertColor.success);
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        this.alerts.showAlert('No se ha podido crear el usuario', AlertColor.danger);
      },
    });
    this.modals.close();
  }

  protected async updateUser(): Promise<void> {
    const user = await this.makeUserDto();
    const id = this.users.selectedUser()?.id;
    if (id) {
      this.users.updateUser(id, user).subscribe({
        next: () => {
          this.alerts.showAlert('Se ha editado el usuario', AlertColor.success);
        },
        error: (err) => {
          console.error(err);
          this.alerts.showAlert('No se ha editado el usuario', AlertColor.danger);
        },
      });
    }
    this.modals.close();
  }

  protected deleteUser(): void {
    const id = this.users.selectedUser()?.id;
    if (id) {
      this.users.deleteUser(id).subscribe({
        next: () => {
          this.alerts.showAlert('Se ha eliminado el usuario', AlertColor.success);
        },
        error: (err) => {
          this.alerts.showAlert('No se ha eliminado el usuario', AlertColor.danger);
        },
      });
    }
    this.modals.close();
  }

  protected matchUser(): boolean {
    return this.authService.currentUser()?.email === this.users.selectedUser()?.email;
  }

  ngAfterViewInit(): void {
    if (this.matchUser() && this.users.modeUserForm() === ModalMode.delete) {
      this.alerts.showAlert('No se puede eliminar usted mismo', AlertColor.info);
    }
  }

  ngOnDestroy(): void {
    this.users.setModeModal(undefined);
    this.users.select(null);
  }
}
