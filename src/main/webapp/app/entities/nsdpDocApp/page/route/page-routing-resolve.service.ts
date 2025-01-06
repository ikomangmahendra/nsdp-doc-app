import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPage } from '../page.model';
import { PageService } from '../service/page.service';

const pageResolve = (route: ActivatedRouteSnapshot): Observable<null | IPage> => {
  const id = route.params.id;
  if (id) {
    return inject(PageService)
      .find(id)
      .pipe(
        mergeMap((page: HttpResponse<IPage>) => {
          if (page.body) {
            return of(page.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pageResolve;
