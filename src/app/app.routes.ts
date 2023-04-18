import { Routes } from '@angular/router';
import { authGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tea',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tea',
    loadComponent: () => import('./tea/tea.page').then((m) => m.TeaPage),
    canActivate: [authGuard],
  },
  {
    path: 'tea-details/:id',
    loadComponent: () => import('./tea-details/tea-details.page').then((m) => m.TeaDetailsPage),
    canActivate: [authGuard],
  },
];
