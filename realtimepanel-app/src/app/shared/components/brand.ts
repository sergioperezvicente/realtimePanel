import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand',
  template: ` <div class="d-inline fs-1">realtime</div>
    <img
      src="favicon.svg"
      [style.width]="size"
      style="filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7)); margin: 10px"
    />
    <div class="d-inline fs-1">panel</div>`,

  host: {
    class: 'd-flex justify-content-center align-items-center',
  },
})
export class Brand {
  @Input() size?: string;
}
