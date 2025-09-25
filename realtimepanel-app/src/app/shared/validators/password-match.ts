import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('passwordInput')?.value;
  const repeat   = group.get('repeatPasswordInput')?.value;
  return password && repeat && password !== repeat
    ? { passwordMismatch: true }
    : null;
};