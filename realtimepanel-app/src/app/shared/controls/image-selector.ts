import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  imports: [],
  template: `
    <input
      #fileInput
      type="file"
      hidden
      [disabled]="disabled"
      (change)="onFileSelected($event)"
      (blur)="onTouched()"
    />
  `,
  host: {
    class: 'card h-100',
    role: 'button',
    '(click)': 'openFileDialog()',
    '[style.background-image]': '"url(" + value + ")"',
  },
  styles: `
  :host {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 180px;
  }`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageSelector), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ImageSelector), multi: true },
  ],
})
export class ImageSelector implements ControlValueAccessor, Validator {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() base?: string;

  value: string = '';
  disabled: boolean = false;

  onChange = (_: any) => {};
  onTouched = () => {};
  onValidatorChange = () => {};

  protected openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // 👈 el File real
      const url = URL.createObjectURL(file);
      this.value = url;
      this.onChange(url);
      this.onTouched();
    }
  }

  writeValue(obj: any): void {
    this.value = obj || this.base;
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
  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
