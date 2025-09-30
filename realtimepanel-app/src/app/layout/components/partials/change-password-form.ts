import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth';
import { AlertColor } from '@app/data/enums/alert-color';
import { Help } from '@app/shared/components/help';
import { InputControl } from '@app/shared/controls/input';
import { passwordMatchValidator } from '@app/shared/validators/password-match';
import { AlertsService } from '@core/services/alerts';
import { ModalsService } from '@core/services/modals';
import { SettingsService } from '@core/services/settings';
import { UserService } from '@core/services/user';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule, InputControl, Help],
  template: `
    <form [formGroup]="passwordForm" class="modal-body">
      <p>Establezca su contraseña:</p>
      @if (modals.showHelp() || settings.getShowHelpAlways()){
      <app-help
        text="Una contraseña segura protege tu información personal al dificultar que terceros accedan a
          tus cuentas y datos sensibles."
      />
      }
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
        Esta acción reinicia la app
      </div>
    </form>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-theme"
        [disabled]="passwordForm.invalid"
        (click)="submit()"
      >
        Guardar y reiniciar
      </button>
    </div>
  `,
  styles: ``,
})
export class ChangePasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly auths = inject(AuthService);
  private readonly alerts = inject(AlertsService);
  protected readonly modals = inject(ModalsService);
  protected readonly settings = inject(SettingsService);

  passwordForm: FormGroup = this.fb.group(
    {
      passwordInput: ['', [Validators.required, Validators.minLength(6)]],
      repeatPasswordInput: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: passwordMatchValidator }
  );

  submit() {
    const password = this.passwordForm.get('passwordInput')?.value;
    this.auths.changePassword(password).subscribe({
      next: () => {
        this.alerts.showAlert('La contraseña se ha cambiado', AlertColor.success);
        this.auths.logout();
      },
      error: () => {
        this.alerts.showAlert('No se ha podido cambiar la contraseña', AlertColor.danger);
      },
    });
    this.modals.close();
  }
}
