import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';
import { Console } from "./components/console";
import { ServerStats } from './components/server-stats';

@Component({
  selector: 'app-server',
  imports: [SectionHeader, Console, ServerStats],
  template: `
    <app-section-header [title]="'Estado del servidor'" />
    <app-server-stats />
    <app-server-console />
  `,
  styles: ``,
})
export class ServerView {}
