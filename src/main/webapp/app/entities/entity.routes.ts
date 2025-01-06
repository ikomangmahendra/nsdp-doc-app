import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'section',
    data: { pageTitle: 'Sections' },
    loadChildren: () => import('./nsdpDocApp/section/section.routes'),
  },
  {
    path: 'page',
    data: { pageTitle: 'Pages' },
    loadChildren: () => import('./nsdpDocApp/page/page.routes'),
  },
  {
    path: 'element',
    data: { pageTitle: 'Elements' },
    loadChildren: () => import('./nsdpDocApp/element/element.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
