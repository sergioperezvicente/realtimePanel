import { Component } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';

@Component({
  selector: 'users-view',
  imports: [SectionHeader],
  template: `
    <app-section-header [title]="'Usuarios'" />
    <p>users works!</p>
  `,
  styles: ``,
})
export class UsersView {}
