import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <div class="col-4">
      <h3 class="text-theme">{{ title }}</h3>
    </div>
    <div class="col-8 d-flex align-items-center justify-content-end">
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
