import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormVariable, NewFormVariable } from '../form-variable.model';

export type PartialUpdateFormVariable = Partial<IFormVariable> & Pick<IFormVariable, 'id'>;

export type EntityResponseType = HttpResponse<IFormVariable>;
export type EntityArrayResponseType = HttpResponse<IFormVariable[]>;

@Injectable({ providedIn: 'root' })
export class FormVariableService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/form-variables', 'nsdpdocapp');

  create(formVariable: NewFormVariable): Observable<EntityResponseType> {
    return this.http.post<IFormVariable>(this.resourceUrl, formVariable, { observe: 'response' });
  }

  update(formVariable: IFormVariable): Observable<EntityResponseType> {
    return this.http.put<IFormVariable>(`${this.resourceUrl}/${this.getFormVariableIdentifier(formVariable)}`, formVariable, {
      observe: 'response',
    });
  }

  partialUpdate(formVariable: PartialUpdateFormVariable): Observable<EntityResponseType> {
    return this.http.patch<IFormVariable>(`${this.resourceUrl}/${this.getFormVariableIdentifier(formVariable)}`, formVariable, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFormVariable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormVariable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFormVariableIdentifier(formVariable: Pick<IFormVariable, 'id'>): string {
    return formVariable.id;
  }

  compareFormVariable(o1: Pick<IFormVariable, 'id'> | null, o2: Pick<IFormVariable, 'id'> | null): boolean {
    return o1 && o2 ? this.getFormVariableIdentifier(o1) === this.getFormVariableIdentifier(o2) : o1 === o2;
  }

  addFormVariableToCollectionIfMissing<Type extends Pick<IFormVariable, 'id'>>(
    formVariableCollection: Type[],
    ...formVariablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const formVariables: Type[] = formVariablesToCheck.filter(isPresent);
    if (formVariables.length > 0) {
      const formVariableCollectionIdentifiers = formVariableCollection.map(formVariableItem =>
        this.getFormVariableIdentifier(formVariableItem),
      );
      const formVariablesToAdd = formVariables.filter(formVariableItem => {
        const formVariableIdentifier = this.getFormVariableIdentifier(formVariableItem);
        if (formVariableCollectionIdentifiers.includes(formVariableIdentifier)) {
          return false;
        }
        formVariableCollectionIdentifiers.push(formVariableIdentifier);
        return true;
      });
      return [...formVariablesToAdd, ...formVariableCollection];
    }
    return formVariableCollection;
  }
}
