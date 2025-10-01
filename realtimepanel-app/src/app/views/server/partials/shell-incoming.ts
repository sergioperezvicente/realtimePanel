import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shell-incoming',
  imports: [CommonModule],
  template: `
    <div
      class="d-flex align-items-center"
      [class.text-success]="level === 'log'"
      [class.text-warning]="level === 'warn'"
      [class.text-debug]="level === 'debug'"
      [class.text-danger]="level === 'error'"
      >
      <div class="d-inline d-none d-lg-block">[SERVER] -</div>
      <div class="d-inline px-2 text-secondary">{{ timestamp | date : 'dd/MM/yyyy HH:mm:ss' }}</div>
      <div class="text-end px-2 d-none d-xl-block" style="min-width: 100px;">
        {{ level | uppercase }}
      </div>
      <div class="d-inline d-none d-md-block text-warning pe-2">[{{ context }}]</div>
      <div class="col">{{ message }}</div>
    </div>
  `,
})
export class ShellIncoming {
  @Input() level?: 'log' | 'warn' | 'debug' | 'error';
  @Input() message?: string;
  @Input() context?: string;
  @Input() timestamp?: Date;
}
