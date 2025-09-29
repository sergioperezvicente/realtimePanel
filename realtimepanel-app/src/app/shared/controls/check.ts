import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-check',
  imports: [],
  template: `
    <input
      class="form-check-input mt-1"
      [class]="display"
      [disabled]="disabled"
      type="checkbox"
      [id]="formControlName"
      [checked]="value"
      (change)="onInputChange($event)"
      (blur)="onTouched()"
    />
    <label
      class="form-check-label ps-3"
      [class.d-none]="!label"
      [class]="display"
      [for]="formControlName"
      >{{ label }}</label
    >
  `,
  host: {
    class: 'd-flex',
    'animate.enter': 'pop-appear',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckControl), multi: true },
  ],
})
export class CheckControl implements ControlValueAccessor, Validator {
  @Input() formControlName?: string;
  @Input() label?: string;
  @Input() display?: string;
  @Input() value = false;
  @Input() set isDisabled(value: boolean) {
    this.disabled = value;
  }
  @Output() changed = new EventEmitter<boolean>()

  
  disabled = false;

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  onInputChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.onChange(checked);
    this.changed.emit(this.value)
  }

  writeValue(obj: boolean): void {
    this.value = obj ?? false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.value ? null : { required: true };
  }
}
