import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <div class="col-5">
      <h3 class="text-theme display-6">{{ title }}</h3>
    </div>
    <div class="col-7 d-flex align-items-center justify-content-end">
      <h5 class=" text-muted text-truncate">{{ currentDate }}</h5>
    </div>
  `,
  host: {
    class: 'row py-2',
  },
})
export class SectionHeader {
  @Input() title!: string;

  protected currentDate: string = '';

  constructor() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
