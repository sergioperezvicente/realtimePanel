import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shell-incoming',
  imports: [CommonModule],
  template: `
    <div class="d-flex align-items-center" [class.text-success]="level === 'log'">
      <div class="d-inline d-none d-lg-block">[SERVER] - </div>
      <div class="col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 col-xxl-2 px-2 text-secondary text-truncate">{{ timestamp | date: 'dd/MM/yyyy HH:mm:ss'}}</div>
      <div class="d-inline ps-2 pe-2 text-right d-none d-lg-block">{{ level | uppercase }}</div>
      <div class="d-inline d-none d-md-block text-warning pe-2">[{{ context }}]</div>
      <div class="col">{{message}}</div>
    </div>
  `,
})
export class ShellIncoming {
  @Input() level?: 'log';
  @Input() message?: string;
  @Input() context?: string;
  @Input() timestamp?: Date;
}
