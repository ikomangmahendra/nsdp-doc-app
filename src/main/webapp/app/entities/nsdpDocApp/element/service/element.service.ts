import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IElement, NewElement } from '../element.model';

export type PartialUpdateElement = Partial<IElement> & Pick<IElement, 'id'>;

export type EntityResponseType = HttpResponse<IElement>;
export type EntityArrayResponseType = HttpResponse<IElement[]>;

@Injectable({ providedIn: 'root' })
export class ElementService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/elements', 'nsdpdocapp');

  create(element: NewElement): Observable<EntityResponseType> {
    return this.http.post<IElement>(this.resourceUrl, element, { observe: 'response' });
  }

  update(element: IElement): Observable<EntityResponseType> {
    return this.http.put<IElement>(`${this.resourceUrl}/${this.getElementIdentifier(element)}`, element, { observe: 'response' });
  }

  partialUpdate(element: PartialUpdateElement): Observable<EntityResponseType> {
    return this.http.patch<IElement>(`${this.resourceUrl}/${this.getElementIdentifier(element)}`, element, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getElementIdentifier(element: Pick<IElement, 'id'>): string {
    return element.id;
  }

  compareElement(o1: Pick<IElement, 'id'> | null, o2: Pick<IElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getElementIdentifier(o1) === this.getElementIdentifier(o2) : o1 === o2;
  }

  addElementToCollectionIfMissing<Type extends Pick<IElement, 'id'>>(
    elementCollection: Type[],
    ...elementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const elements: Type[] = elementsToCheck.filter(isPresent);
    if (elements.length > 0) {
      const elementCollectionIdentifiers = elementCollection.map(elementItem => this.getElementIdentifier(elementItem));
      const elementsToAdd = elements.filter(elementItem => {
        const elementIdentifier = this.getElementIdentifier(elementItem);
        if (elementCollectionIdentifiers.includes(elementIdentifier)) {
          return false;
        }
        elementCollectionIdentifiers.push(elementIdentifier);
        return true;
      });
      return [...elementsToAdd, ...elementCollection];
    }
    return elementCollection;
  }
}
