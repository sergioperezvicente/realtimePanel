import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

@Component({
  selector: 'app-section-collapse',
  imports: [CommonModule],
  template: `
    <div class="shadow p-4 pb-5" animate.enter="collapse-down">
      <ng-container [ngComponentOutlet]="component ?? null"></ng-container>
    </div>
  `,
})
export class SectionCollapse {
  @Input() component?: Type<any> | null;
}
