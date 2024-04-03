import { Routes } from '@angular/router';
import { APP_PATHS } from './app.paths';

export const routes: Routes = [
  {
    path: APP_PATHS.LOGIN,
    loadComponent: () =>
      import('./pages/login-container').then(c => c.LoginContainerComponent),
  },
  {
    path: APP_PATHS.DASHBOARD,
    loadComponent: () =>
      import('./pages/dashboard').then(c => c.DashboardContainerComponent),
  },
  {
    path: '',
    redirectTo: APP_PATHS.LOGIN,
    pathMatch: 'full',
  },
];
