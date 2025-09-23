import { Routes } from '@angular/router';
import { privateGuard } from '@core/guards/private-guard';
import { publicGuard } from '@core/guards/public-guard';
import { LoginView } from './auth/login';
import { Layout } from '@layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        canActivate: [privateGuard]
    },
    {
        path: 'auth/login',
        canActivate: [publicGuard],
        component: LoginView,
        title: 'Acceso'
    },
    { path: '**', redirectTo: '' },
];
