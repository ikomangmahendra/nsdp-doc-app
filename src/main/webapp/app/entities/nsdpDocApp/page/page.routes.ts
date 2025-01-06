import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PageResolve from './route/page-routing-resolve.service';

const pageRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/page.component').then(m => m.PageComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/page-detail.component').then(m => m.PageDetailComponent),
    resolve: {
      page: PageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/page-update.component').then(m => m.PageUpdateComponent),
    resolve: {
      page: PageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/page-update.component').then(m => m.PageUpdateComponent),
    resolve: {
      page: PageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pageRoute;
