import { Component } from '@angular/core';
import { Header } from './components/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer';
import { Sidebar } from './components/sidebar';
import { SidebarOffcanvas } from './components/sidebar-offcanvas';
import { AppStatus } from '@shared/app-status';
import { Alerts } from '@shared/components/alerts';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer, Sidebar, SidebarOffcanvas, AppStatus, Alerts],
  template: `
    <!-- <app-status /> -->
    <app-sidebar />
    <app-sidebar-offcanvas />
    <main class="col p-0">
      <app-header />
      <section class="container-fluid pt-3 pb-5" style="height: 84vh; overflow-y: auto;">
        <router-outlet />
      </section>
      <app-footer />
    </main>
    <app-alerts />
  `,
  host: {
    class: 'row',
  },
})
export class Layout {}
