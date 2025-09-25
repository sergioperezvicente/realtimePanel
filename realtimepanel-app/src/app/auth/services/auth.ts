import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CheckTokenResponse, LoginResponse } from '../interfaces/auth';
import { environment } from '@env/environment';
import { WsService } from '@core/services/ws';
import { User } from '@app/data/models/user';
import { AuthStatus } from '@app/data/enums/auth-status';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl: string = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly ws = inject(WsService);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('lastUrl');
    this._currentUser.set(null);
    this.ws.disconnect();
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  checkAuthStatus(): Observable<boolean> {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(`${this.apiUrl}/auth/check-token`, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
        sessionStorage.removeItem('token');
        this.ws.disconnect()
        return of(false);
      })
    );
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    sessionStorage.setItem('token', token);
    this.ws.connect(token);
    return true;
  }
}
