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
            path: 'add',
            loadComponent: () => import('./members/member-form/member-form.page').then((m) => m.MemberFormPage),
            data: {addOrUpdate: 'add'},
          },
          {
            path: ':memberId/update',
            loadComponent: () => import('./members/member-form/member-form.page').then((m) => m.MemberFormPage),
            data: {addOrUpdate: 'update'},
          },
        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadComponent: () => import('./events/events-list/events-list.page').then(m => m.EventsListPage)
          },
          {
            path: 'add',
            loadComponent: () => import('./events/event-form/event-form.page').then((m) => m.EventFormPage),
            data: {addOrUpdate: 'add'},
          },
          {
            path: ':eventId',
            children: [
              {
                path: 'update',
                loadComponent: () => import('./events/event-form/event-form.page').then((m) => m.EventFormPage),
                data: {addOrUpdate: 'update'},
              },
              {
                path: 'view',
                loadComponent: () => import('./events/event-view/event-view.page').then((m) => m.EventViewPage),
              },
            ]
          },

        ]
      }
    ]
  },
]
