import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import ElementResolve from './route/element-routing-resolve.service';

const elementRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/element.component').then(m => m.ElementComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/element-detail.component').then(m => m.ElementDetailComponent),
    resolve: {
      element: ElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/element-update.component').then(m => m.ElementUpdateComponent),
    resolve: {
      element: ElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/element-update.component').then(m => m.ElementUpdateComponent),
    resolve: {
      element: ElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default elementRoute;
