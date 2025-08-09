import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./_pages/main-nav/main-nav.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./_pages/login/login.page').then( m => m.LoginPage)
  },
];
