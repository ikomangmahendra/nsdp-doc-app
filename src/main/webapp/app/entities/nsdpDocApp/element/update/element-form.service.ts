import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IElement, NewElement } from '../element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IElement for edit and NewElementFormGroupInput for create.
 */
type ElementFormGroupInput = IElement | PartialWithRequiredKeyOf<NewElement>;

type ElementFormDefaults = Pick<NewElement, 'id'>;

type ElementFormGroupContent = {
  id: FormControl<IElement['id'] | NewElement['id']>;
  type: FormControl<IElement['type']>;
  name: FormControl<IElement['name']>;
  page: FormControl<IElement['page']>;
};

export type ElementFormGroup = FormGroup<ElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ElementFormService {
  createElementFormGroup(element: ElementFormGroupInput = { id: null }): ElementFormGroup {
    const elementRawValue = {
      ...this.getFormDefaults(),
      ...element,
    };
    return new FormGroup<ElementFormGroupContent>({
      id: new FormControl(
        { value: elementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(elementRawValue.type, {
        validators: [Validators.required],
      }),
      name: new FormControl(elementRawValue.name, {
        validators: [Validators.required],
      }),
      page: new FormControl(elementRawValue.page),
    });
  }

  getElement(form: ElementFormGroup): IElement | NewElement {
    return form.getRawValue() as IElement | NewElement;
  }

  resetForm(form: ElementFormGroup, element: ElementFormGroupInput): void {
    const elementRawValue = { ...this.getFormDefaults(), ...element };
    form.reset(
      {
        ...elementRawValue,
        id: { value: elementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ElementFormDefaults {
    return {
      id: null,
    };
  }
}
