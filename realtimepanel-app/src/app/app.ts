import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<div class="text-warning">hola mundo!</div> <router-outlet />`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('realtimepanel-app');
}
