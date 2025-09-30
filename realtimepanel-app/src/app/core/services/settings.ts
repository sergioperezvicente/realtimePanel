import { HttpClient } from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { debounceTime, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiUrl: string = `${environment.apiUrl}/files/settings`;
  private readonly http = inject(HttpClient);

  // ** GENERAL SETTINGS ** //
  private readonly _developerMode = signal<boolean>(false);

  getDeveloperMode = computed(() => this._developerMode());

  setDeveloperMode(mode: boolean) {
    this._developerMode.set(mode);
  }

  // ** VISUAL SETTINGS ** //
  private readonly _theme = signal<'dark' | 'light'>('dark');
  private readonly _showHelpAlways = signal<boolean>(false);
  private readonly _rgbColorTheme = signal<string>('#dd6969');

  getTheme = computed(() => this._theme());
  getShowHelpAlways = computed(() => this._showHelpAlways());
  getRgbColorTheme = computed(() => this._rgbColorTheme());

  setTheme(mode: 'dark' | 'light') {
    this._theme.set(mode);
  }
  setShowHelpAlways(mode: boolean) {
    this._showHelpAlways.set(mode);
  }
  setRgbColorTheme(color: string) {
    this._rgbColorTheme.set(color);
  }

  //** ADMIN SETTINGS */
  private readonly _showServer = signal<boolean>(false);

  getShowServer = computed(() => this._showServer())

  setShowServer(mode: boolean) {
    this._showServer.set(mode)
  }



  onThemeChangeffect = effect(() => {
    const value = this.getTheme();
    this.applyTheme(value);
  });

  onColorChangedEffect = effect(() => {
    const value = this.getRgbColorTheme();
    this.applyColorTheme(value);
  });

  applySettingFromDB() {
    this.getSettings().subscribe({
      next: (res) => this.loadSettings(res),
      error: (error) => console.error(error),
    });
  }

  saveSettingsOnDB(): void {
    const json = this.makeJson();
    this.saveSettings(json).subscribe({
      next: (res) => console.log('Ajustes guardados exitosamente'),
      error: (error) => console.error('Algo falló al guardar los ajustes', error),
    });
  }

  private loadSettings(settings: UserSettings) {
    //** AJUSTES GENERALES */
    this._developerMode.set(settings.developerMode);
    //** AJUSTES VISUALES */
    this._theme.set(settings.theme);
    this._showHelpAlways.set(settings.helpAlways);
    this._rgbColorTheme.set(settings.themeColor);
    //** AJUSTES ADMINISTRATIVOS */
    this._showServer.set(settings.showServer)

    //** ACTUALIZAR INTERFAZ DE USUARIO */
    this.applyTheme(settings.theme);
    this.applyColorTheme(settings.themeColor);
  }

  private makeJson(): UserSettings {
    const json: UserSettings = {
      developerMode: this._developerMode(),
      theme: this._theme(),
      helpAlways: this._showHelpAlways(),
      themeColor: this._rgbColorTheme(),
      showServer: this._showServer(),
    };
    return json;
  }

  private applyTheme(mode: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-bs-theme', mode);
  }

  private applyColorTheme(color: string) {
    const rgb = this.hexToRgbString(color);

    document.documentElement.style.setProperty('--color-theme-rgb', rgb);
    document.documentElement.style.setProperty('--color-theme-rgba25', `rgba(${rgb}, 0.25)`);

    // Hover: 15% más claro
    const hexLight = this.lightenColor(color, 15);
    document.documentElement.style.setProperty('--color-theme-light', hexLight);

    // Active: 15% más oscuro
    const hexDark = this.darkenColor(color, 15);
    document.documentElement.style.setProperty('--color-theme-dark', hexDark);

    // Texto normal
    const textNormal = this.isColorLight(color) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text', textNormal);

    // Texto hover
    const textHover = this.isColorLight(hexLight) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text-light', textHover);

    // Texto active
    const textActive = this.isColorLight(hexDark) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text-dark', textActive);
  }

  private darkenColor(hex: string, percent: number): string {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const factor = (100 - percent) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
      .toString(16)
      .padStart(2, '0')}`;
  }

  private isColorLight(hex: string): boolean {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    // Fórmula de luminosidad percibida
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186; // umbral ajustable
  }

  private lightenColor(hex: string, percent: number): string {
    // percent: 0–100 (por ejemplo 15 = 15% más claro)
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const newR = Math.round(r + (255 - r) * (percent / 100));
    const newG = Math.round(g + (255 - g) * (percent / 100));
    const newB = Math.round(b + (255 - b) * (percent / 100));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
      .toString(16)
      .padStart(2, '0')}`;
  }

  private hexToRgbString(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  // ** COMUNICACION CON LA API ** //
  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}`);
  }

  saveSettings(settings: UserSettings): Observable<any> {
    return this.http.patch<UserSettings>(`${this.apiUrl}`, settings);
  }
}
