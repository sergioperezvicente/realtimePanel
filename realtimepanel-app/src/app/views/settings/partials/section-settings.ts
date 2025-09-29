import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MaterialButton } from '@app/shared/controls/material-button';

@Component({
  selector: 'app-section-settings',
  imports: [MaterialButton],
  template: `
    <div class="col display-7 d-flex align-items-center ps-0">
      <div class="display-3 material-symbols-outlined mx-3">
        {{ icon }}
      </div>
      <div class="d-block">{{ title }}</div>
    </div>
    <div class="col-1 align-content-center text-end pe-5 ">
      @if(isShow){
        <app-material-button icon="arrow_drop_up" display="5" />
      } @else {
        <app-material-button icon="arrow_drop_down" display="5" />
      }
    
    </div>
  `,
  host: {
    class: 'section-theme row shadow mx-0 border-bottom',
    role: 'button',
    '(click)': 'this.section.emit(title)',
  },
})
export class SectionSetting {
  @Input() title?: string;
  @Input() icon?: string;
  @Output() section = new EventEmitter<string>();
  @Input() isShow?: boolean;
  
}
