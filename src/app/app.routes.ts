import { Routes } from '@angular/router';
import { authGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/tea',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
