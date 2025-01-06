import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISection } from '../section.model';
import { SectionService } from '../service/section.service';

const sectionResolve = (route: ActivatedRouteSnapshot): Observable<null | ISection> => {
  const id = route.params.id;
  if (id) {
    return inject(SectionService)
      .find(id)
      .pipe(
        mergeMap((section: HttpResponse<ISection>) => {
          if (section.body) {
            return of(section.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default sectionResolve;
