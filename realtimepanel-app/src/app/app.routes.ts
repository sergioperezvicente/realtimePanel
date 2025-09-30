import { Routes } from '@angular/router';
import { privateGuard } from '@core/guards/private-guard';
import { publicGuard } from '@core/guards/public-guard';
import { LoginView } from './auth/login';
import { Layout } from '@layout/layout';
import { accessGuard } from '@core/guards/access-guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [privateGuard, accessGuard],
    component: Layout,
    children: [
      {
        path: '',
        title: 'realtimePanel - Dashboard',
        loadComponent: () => import('@views/dashboard/dashboard').then((m) => m.DashboardView),
      },
      {
        path: 'settings',
        title: 'realtimePanel - Configuración',
        loadComponent: () => import('@views/settings/settings').then((m) => m.SettingsView),
      },
      {
        path: 'users',
        title: 'realtimePanel - Usuarios',
        loadComponent: () => import('@views/users/users').then((m) => m.UsersView),
      },
      {
        path: 'server',
        title: 'realtimePanel - Servidor',
        loadComponent: () => import('@views/server/server').then((m) => m.ServerView),
      },
    ],
  },
  {
    path: 'auth/login',
    canActivate: [publicGuard],
    component: LoginView,
    title: 'realtimePanel - Acceso',
  },
  { path: '**', redirectTo: '' },
];
