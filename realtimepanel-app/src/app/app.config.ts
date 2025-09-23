import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import packageInfo from '../../package.json';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => console.log(`${packageInfo.name + ' - version: ' + packageInfo.version}`)),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
};
