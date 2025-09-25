import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-material-button',
  template: `<button
    class="material-symbols-outlined span-btn"
    [class]="color + ' ' + 'display-' + display"
    [attr.title]="title"
    [disabled]="disabled"
  >
    {{ icon }}
  </button>`,
})
export class MaterialButton {
  @Input() title?: string;
  @Input() icon!: string;
  @Input() display?: string;
  @Input() color?: string;
  @Input() disabled: boolean = false;
}
