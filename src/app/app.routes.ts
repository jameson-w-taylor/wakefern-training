import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tea',
    pathMatch: 'full',
  },
  {
    path: 'tea',
    loadComponent: () => import('./tea/tea.page').then((m) => m.TeaPage),
  },
];
