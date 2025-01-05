import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormVariable } from '../form-variable.model';
import { FormVariableService } from '../service/form-variable.service';

const formVariableResolve = (route: ActivatedRouteSnapshot): Observable<null | IFormVariable> => {
  const id = route.params.id;
  if (id) {
    return inject(FormVariableService)
      .find(id)
      .pipe(
        mergeMap((formVariable: HttpResponse<IFormVariable>) => {
          if (formVariable.body) {
            return of(formVariable.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default formVariableResolve;
