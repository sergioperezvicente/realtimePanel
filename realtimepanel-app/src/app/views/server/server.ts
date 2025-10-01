import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';
import { ServerStats } from './components/server-stats';
import { Terminal } from './components/terminal';

@Component({
  selector: 'app-server',
  imports: [SectionHeader, Terminal, ServerStats],
  template: `
    <app-section-header [title]="'Estado del servidor'" />
    <app-server-stats />
    <app-server-terminal />
  `,
  styles: ``,
})
export class ServerView {}
