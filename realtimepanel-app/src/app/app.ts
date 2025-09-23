import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { AppStatus } from '@enums/app-status';
import { AuthService } from './auth/services/auth';
import { WsService } from '@core/services/ws';
import { AuthStatus } from '@enums/auth-status';
import { WsStatus } from '@enums/ws-status';
import packageInfo from '../../package.json'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly ws = inject(WsService);
  private readonly router = inject(Router);
  private readonly _status = signal<AppStatus>(AppStatus.disconnected);

  public version: string = packageInfo.version;
  public year: string = packageInfo.copyright;
  public website: string = packageInfo.website;
  public description: string = packageInfo.description;
  public status = computed(() => this._status());

  public authStatusChangedEffect = effect(() => {
    this.checkServer();
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        this._status.set(AppStatus.loading);
        return;
      case AuthStatus.authenticated:
        this._status.set(AppStatus.connected);
        const url = this.authService.currentUser()?.access[0];
        this.router.navigate([sessionStorage.getItem('lastUrl') || url]);
        return;
      case AuthStatus.notAuthenticated:
        this._status.set(AppStatus.disconnected);
        //this.router.navigate(['/auth/login']);
        return;
    }
  });

  public wsStatusChangedEffect = effect(() => {
    switch (this.ws.status()) {
      case WsStatus.syncronized:
        this._status.set(AppStatus.syncronized);
        return;
      case WsStatus.off:
        this.checkServer()
        return;
    }
  });

  public checkServer(): void {
    this.http.get<void>(`${this.apiUrl}`).subscribe({
      next: () => this._status.set(AppStatus.connected),
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this._status.set(AppStatus.disconnected);
        } else {
          this._status.set(AppStatus.offline);
        }
      },
    });
  }
}
