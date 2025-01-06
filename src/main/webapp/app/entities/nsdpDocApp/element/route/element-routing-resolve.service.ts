import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IElement } from '../element.model';
import { ElementService } from '../service/element.service';

const elementResolve = (route: ActivatedRouteSnapshot): Observable<null | IElement> => {
  const id = route.params.id;
  if (id) {
    return inject(ElementService)
      .find(id)
      .pipe(
        mergeMap((element: HttpResponse<IElement>) => {
          if (element.body) {
            return of(element.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default elementResolve;
