import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';

@Component({
  selector: 'app-server',
  imports: [SectionHeader],
  template: `
    <app-section-header [title]="'Estado del servidor'" />
  `,
  styles: ``
})
export class ServerView {

}
