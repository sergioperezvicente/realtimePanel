import { Component, inject } from '@angular/core';
import { Header } from './components/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer';
import { Sidebar } from './components/sidebar';
import { SidebarOffcanvas } from './components/sidebar-offcanvas';
import { AppStatus } from '@shared/app-status';
import { Alerts } from '@shared/components/alerts';
import { Chat } from './components/chat';
import { App } from '@app/app';
import { Modals } from "@app/shared/components/modals";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer, Sidebar, SidebarOffcanvas, Alerts, Chat, AppStatus, Modals],
  template: `
    @if (this.app.status() !== 'syncronized') {
    <app-status />
    }
    <app-sidebar />
    <app-sidebar-offcanvas />
    <main class="col p-0">
      <app-header />
      <section class="container-fluid pt-3 pb-5" id="main">
        <router-outlet />
      </section>
      <app-footer />
    </main>
    <app-chat />
    <app-alerts />
    <app-modals />
  `,
  host: {
    class: 'row',
  },
})
export class Layout {
  protected readonly app = inject(App);
}
