import { Component } from '@angular/core';
import { SectionHeader } from "@app/shared/partials/section-header";

@Component({
  selector: 'dashboard-view',
  imports: [SectionHeader],
  template: `
    <app-section-header [title]="'Dashboard'"/>
    <p>
      dashboard works!
    </p>
  `,
  styles: ``
})
export class DashboardView {

}
