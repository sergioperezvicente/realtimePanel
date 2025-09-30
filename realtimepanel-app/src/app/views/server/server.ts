import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';

@Component({
  selector: 'app-server',
  imports: [SectionHeader],
  template: `
    <app-section-header [title]="'Estado del servidor'" />

    <div class="card shadow">
      <div class="card-header display-8 d-flex align-items-center ps-0">
        <div class="display-6 material-symbols-outlined mx-3">dns</div>
        <div class="d-block">Consola</div>
      </div>
      <div class="card-body"></div>
      <!-- <div class="card-footer"></div> -->
    </div>
  `,
  styles: ``,
})
export class ServerView {}
