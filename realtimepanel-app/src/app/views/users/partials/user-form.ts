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

@Component({
  imports: [ReactiveFormsModule, InputControl, ImageSelector],
  template: `
    <div class="modal-body">
      <form [formGroup]="userForm">
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
        <h5>Acceso y Permisos</h5>
        <hr class="mt-0" />
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
      </form>
    </div>
    <div class="modal-footer">
      @switch (userService.modeUserForm()) { @case ('edit') {<button
        class="btn btn-success"
        [disabled]="userForm.invalid"
        (click)="editUser()"
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
  private readonly menuService = inject(MenuService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalsService);
  private readonly alertsService = inject(AlertsService);
  private readonly uploadsService = inject(UploadService);
  protected readonly userService = inject(UserService);

  protected userForm!: FormGroup;
  protected access: any[] = [];

  constructor() {
    this.access = this.menuService.getMenuItems();
    const user = this.userService.selectedUser();
    switch (this.userService.modeUserForm()) {
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
    //Si hay imagen... subirla
    if (user.imageUrl) {
      const file = await this.uploadsService.convertBlobToFilePNG(user.imageUrl);
      user.imageUrl = await new Promise<string>((resolve, reject) => {
        this.uploadsService.uploadImage(file, 'avatars').subscribe({
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
    this.userService.createUser(user).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Usuario creado correctamente', AlertColor.success);
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        this.alertsService.showAlert('No se ha podido crear el usuario', AlertColor.danger);
      },
    });
    this.modalService.close();
  }

  protected async editUser(): Promise<void> {
    //TODO: Editar en base de datos el usuario seleccionado y mostramos alerta
    //Cerramos el modal activo
    this.modalService.close();
  }

  protected deleteUser(): void {
    const id = this.userService.selectedUser()?.id;
    if (id) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.alertsService.showAlert('Se ha eliminado el usuario', AlertColor.success);
        },
        error: (err) => {
          this.alertsService.showAlert('No se ha eliminado el usuario', AlertColor.danger);
        },
      });
    }
    this.modalService.close();
  }

  protected matchUser(): boolean {
    return this.authService.currentUser()?.email === this.userService.selectedUser()?.email;
  }

  ngAfterViewInit(): void {
    if (this.matchUser() && this.userService.modeUserForm() === ModalMode.delete) {
      this.alertsService.showAlert('No se puede eliminar usted mismo', AlertColor.info);
    }
  }

  ngOnDestroy(): void {
    this.userService.setModeModal(undefined);
    this.userService.select(null);
  }
}
