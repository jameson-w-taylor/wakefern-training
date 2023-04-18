import { NgModule } from '@angular/core';
import { authGuard } from '@app/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'about',
        loadComponent: () => import('../about/about.page').then((c) => c.AboutPage),
      },
      {
        path: 'tasting-notes',
        loadComponent: () => import('../tasting-notes/tasting-notes.page').then((c) => c.TastingNotesPage),
      },
      {
        path: 'tea',
        loadComponent: () => import('../tea/tea.page').then((c) => c.TeaPage),
      },
      {
        path: 'tea/tea-details/:id',
        loadComponent: () => import('../tea-details/tea-details.page').then((c) => c.TeaDetailsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/tea',
        pathMatch: 'full',
      },
    ],
  },
];
