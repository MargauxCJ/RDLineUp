import {Route} from '@angular/router';
import {MainNavPage} from './main-nav.page';
import {AuthGuard} from '../../_guards/auth.guard';


export const routes: Route[] = [
  {
    path: '',
    component: MainNavPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
      },
      {
        path: 'members',
        children: [
          {
            path: '',
            loadComponent: () => import('./members/members-list/members-list.page').then( m => m.MembersListPage)
          },
          {
            path: ':idMember/update',
            loadComponent: () => import('./members/members-list/members-list.page').then( m => m.MembersListPage)
          },
        ]
      }
    ]
  },
]
