import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import FormVariableResolve from './route/form-variable-routing-resolve.service';

const formVariableRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/form-variable.component').then(m => m.FormVariableComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/form-variable-detail.component').then(m => m.FormVariableDetailComponent),
    resolve: {
      formVariable: FormVariableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/form-variable-update.component').then(m => m.FormVariableUpdateComponent),
    resolve: {
      formVariable: FormVariableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/form-variable-update.component').then(m => m.FormVariableUpdateComponent),
    resolve: {
      formVariable: FormVariableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default formVariableRoute;
