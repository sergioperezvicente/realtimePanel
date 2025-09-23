import { Component, forwardRef, Host, Input, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormControl,
  ControlContainer,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule],
  template: `
    <input
      class="form-control"
      autocomplete="off"
      [ngClass]="{
        'is-invalid': control?.invalid && (control?.touched || control?.dirty)
      }"
      [id]="formControlName"
      [type]="type"
      [disabled]="disabled"
      [placeholder]="placeholder"
      [value]="value"
      (input)="inputHandler($any($event.target).value)"
      (blur)="onTouched()"
    />
    <label [for]="formControlName">{{ label }}</label>
    <div class="invalid-feedback">{{ validation }}</div>
  `,
  host: {
    class: 'form-floating',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputControl), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputControl), multi: true },
  ],
})
export class InputControl implements ControlValueAccessor, Validator {
  @Input() formControlName: string = '';
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string = '';
  @Input() validation?: string = '';

  value: string = '';
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};
  onValidatorChange = () => {};

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer) {}

  get control(): FormControl | null {
    return this.controlContainer?.control?.get(this.formControlName) as FormControl | null;
  }

  inputHandler(v: string) {
    this.value = v;
    this.onChange(v);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
  writeValue(obj: any): void {
    this.value = obj ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
