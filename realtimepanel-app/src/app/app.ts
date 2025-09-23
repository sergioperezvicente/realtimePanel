import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { AppStatus } from '@enums/app-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './app.css'
})
export class App {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  private readonly _status = signal<AppStatus>(AppStatus.disconnected);

  public status = computed(() => this._status());

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
