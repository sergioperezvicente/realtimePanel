import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';
import { Console } from "./components/console";

@Component({
  selector: 'app-server',
  imports: [SectionHeader, Console],
  template: `
    <app-section-header [title]="'Estado del servidor'" />

    <app-server-console />
  `,
  styles: ``,
})
export class ServerView {}
