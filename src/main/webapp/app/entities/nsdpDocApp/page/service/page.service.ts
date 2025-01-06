import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPage, NewPage } from '../page.model';

export type PartialUpdatePage = Partial<IPage> & Pick<IPage, 'id'>;

export type EntityResponseType = HttpResponse<IPage>;
export type EntityArrayResponseType = HttpResponse<IPage[]>;

@Injectable({ providedIn: 'root' })
export class PageService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pages', 'nsdpdocapp');

  create(page: NewPage): Observable<EntityResponseType> {
    return this.http.post<IPage>(this.resourceUrl, page, { observe: 'response' });
  }

  update(page: IPage): Observable<EntityResponseType> {
    return this.http.put<IPage>(`${this.resourceUrl}/${this.getPageIdentifier(page)}`, page, { observe: 'response' });
  }

  partialUpdate(page: PartialUpdatePage): Observable<EntityResponseType> {
    return this.http.patch<IPage>(`${this.resourceUrl}/${this.getPageIdentifier(page)}`, page, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPageIdentifier(page: Pick<IPage, 'id'>): string {
    return page.id;
  }

  comparePage(o1: Pick<IPage, 'id'> | null, o2: Pick<IPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getPageIdentifier(o1) === this.getPageIdentifier(o2) : o1 === o2;
  }

  addPageToCollectionIfMissing<Type extends Pick<IPage, 'id'>>(
    pageCollection: Type[],
    ...pagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pages: Type[] = pagesToCheck.filter(isPresent);
    if (pages.length > 0) {
      const pageCollectionIdentifiers = pageCollection.map(pageItem => this.getPageIdentifier(pageItem));
      const pagesToAdd = pages.filter(pageItem => {
        const pageIdentifier = this.getPageIdentifier(pageItem);
        if (pageCollectionIdentifiers.includes(pageIdentifier)) {
          return false;
        }
        pageCollectionIdentifiers.push(pageIdentifier);
        return true;
      });
      return [...pagesToAdd, ...pageCollection];
    }
    return pageCollection;
  }
}
