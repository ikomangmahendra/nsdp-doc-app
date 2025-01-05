import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'form-variable',
    data: { pageTitle: 'FormVariables' },
    loadChildren: () => import('./nsdpDocApp/form-variable/form-variable.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
