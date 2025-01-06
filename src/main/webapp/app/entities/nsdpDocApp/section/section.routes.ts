import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import SectionResolve from './route/section-routing-resolve.service';

const sectionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/section.component').then(m => m.SectionComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/section-detail.component').then(m => m.SectionDetailComponent),
    resolve: {
      section: SectionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/section-update.component').then(m => m.SectionUpdateComponent),
    resolve: {
      section: SectionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/section-update.component').then(m => m.SectionUpdateComponent),
    resolve: {
      section: SectionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sectionRoute;
