import { Routes } from '@angular/router';
import { authGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tea',
    pathMatch: 'full',
  },
  {
    path: 'tea',
    loadComponent: () => import('./tea/tea.page').then((m) => m.TeaPage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
];
