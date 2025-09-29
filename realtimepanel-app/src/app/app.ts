import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { AppStatus } from '@enums/app-status';
import { AuthService } from './auth/services/auth';
import { WsService } from '@core/services/ws';
import { AuthStatus } from '@enums/auth-status';
import { WsStatus } from '@enums/ws-status';
import packageInfo from '../../package.json';
import { SettingsService } from '@core/services/settings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly ws = inject(WsService);
  private readonly settings = inject(SettingsService)
  private readonly router = inject(Router);
  private readonly _status = signal<AppStatus>(AppStatus.loading);

  public version: string = packageInfo.version;
  public year: string = packageInfo.copyright;
  public website: string = packageInfo.website;
  public description: string = packageInfo.description;
  public status = computed(() => this._status());

  // constructor() {
  //   this.checkServer();
  // }

  public authStatusChangedEffect = effect(() => {
    switch (this.auth.authStatus()) {
      case AuthStatus.checking:
        this._status.set(AppStatus.loading);
        return;
      case AuthStatus.authenticated:
        this._status.set(AppStatus.syncronized);
        const url = this.auth.currentUser()?.access[0];
        this.router.navigate([sessionStorage.getItem('lastUrl') || url]);
        return;
      case AuthStatus.notAuthenticated:
        this.settings.applyColorTheme('#dd6969')
        this._status.set(AppStatus.disconnected);
        this.router.navigate(['/auth/login']);
        return;
    }
  });

  public wsStatusChangedEffect = effect(() => {
    switch (this.ws.status()) {
      case WsStatus.syncronized:
        this._status.set(AppStatus.syncronized);
        return;
      case WsStatus.expired:
        this._status.set(AppStatus.disconnected);
        this.router.navigate(['/auth/login']);
        return;
      case WsStatus.off:
        this._status.set(AppStatus.disconnected)
        //this.checkServer()
        return;
    }
  });

  public checkServer(): void {
    this.http.get<void>(`${this.apiUrl}`).subscribe({
      next: () => this._status.set(AppStatus.connected),
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case 401:
            this._status.set(AppStatus.disconnected);
            break;
          default:
            this._status.set(AppStatus.offline);
            break;
        }
      },
    });
  }
}
