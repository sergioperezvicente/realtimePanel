import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth';
import { AlertColor } from '@app/data/enums/alert-color';
import { InputControl } from '@app/shared/controls/input';
import { passwordMatchValidator } from '@app/shared/validators/password-match';
import { AlertsService } from '@core/services/alerts';
import { ModalsService } from '@core/services/modals';
import { UserService } from '@core/services/user';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule, InputControl],
  template: `
    <form [formGroup]="passwordForm" class="modal-body">
      <p>Establezca su contraseña:</p>
      <div class="mb-3">
        <app-input
          formControlName="passwordInput"
          type="password"
          label="Contraseña"
          validation="Mínimo 6 caracteres"
        />
      </div>
      <div class="mb-3">
        <app-input
          formControlName="repeatPasswordInput"
          type="password"
          label="Repita contraseña"
          validation="Las contraseñas no coinciden"
        />
      </div>
    </form>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-theme"
        [disabled]="passwordForm.invalid"
        (click)="submit()"
      >
        Guardar
      </button>
    </div>
  `,
  styles: ``,
})
export class ChangePasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly authS = inject(AuthService);
  private readonly alertS = inject(AlertsService);
  private readonly modalS = inject(ModalsService);

  passwordForm: FormGroup = this.fb.group(
    {
      passwordInput: ['', [Validators.required, Validators.minLength(6)]],
      repeatPasswordInput: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator }
  );

  submit() {
    const password = this.passwordForm.get('passwordInput')?.value;
    this.authS.changePassword(password).subscribe({
      next: () => {
        this.alertS.showAlert('La contraseña se ha cambiado', AlertColor.success)
      },
      error: () => {
        this.alertS.showAlert('No se ha podido cambiar la contraseña', AlertColor.danger)
      }
    });
    this.modalS.close()
  }
}
