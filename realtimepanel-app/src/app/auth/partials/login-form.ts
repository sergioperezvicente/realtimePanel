import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputControl } from '@shared/controls/input';
import { App } from '@app/app';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputControl],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="card-body">
      <h5 class="text-center mb-3">{{ this.app.description }}</h5>
      <div class="mb-3">
        <app-input
          formControlName="username"
          type="text"
          label="Usuario"
          validation="El usuario debe ser una direccion de correo válida"
        />
      </div>
      <div class="mb-3">
        <app-input
          formControlName="password"
          type="password"
          label="Contraseña"
          validation="La contraseña tiene que tener al menos 6 caracteres"
        />
      </div>
      @if(error()){
      <div
        class="d-flex justify-content-center mb-3 text-danger fw-semibold"
        animate.enter="pop-appear"
      >
        El usuario o la contraseña son incorrectos
      </div>
      } @if(conflict()){
      <div
        class="d-flex justify-content-center mb-3 text-warning fw-semibold"
        animate.enter="pop-appear"
      >
        El usuario ya está online
      </div>
      }
      <div class="d-flex justify-content-center">
        <button class="btn btn-theme col-9" [disabled]="loginForm.invalid">Iniciar</button>
      </div>
    </form>
  `,
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected readonly app = inject(App);

  protected error = signal<boolean>(false);
  protected conflict = signal<boolean>(false);

  protected loginForm: FormGroup = this.fb.group({
    username: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['admin1234', [Validators.required, Validators.minLength(6)]],
  });

  onLogin(): void {
    this.app.checkServer();
    const { username, password } = this.loginForm.value;
    //console.log(username, password);
    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => {
        switch (err.status) {
          case 409:
            this.conflict.set(true);
            setTimeout(() => {
              this.conflict.set(false);
            }, 3000);
            break;
          default:
            this.error.set(true);
            setTimeout(() => {
              this.error.set(false);
            }, 3000);
            break;
        }
      },
    });
  }
}
