import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IFormVariable, NewFormVariable } from '../form-variable.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFormVariable for edit and NewFormVariableFormGroupInput for create.
 */
type FormVariableFormGroupInput = IFormVariable | PartialWithRequiredKeyOf<NewFormVariable>;

type FormVariableFormDefaults = Pick<NewFormVariable, 'id'>;

type FormVariableFormGroupContent = {
  id: FormControl<IFormVariable['id'] | NewFormVariable['id']>;
  sectionCode: FormControl<IFormVariable['sectionCode']>;
  sectionName: FormControl<IFormVariable['sectionName']>;
  formVariableType: FormControl<IFormVariable['formVariableType']>;
  orderIndex: FormControl<IFormVariable['orderIndex']>;
};

export type FormVariableFormGroup = FormGroup<FormVariableFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FormVariableFormService {
  createFormVariableFormGroup(formVariable: FormVariableFormGroupInput = { id: null }): FormVariableFormGroup {
    const formVariableRawValue = {
      ...this.getFormDefaults(),
      ...formVariable,
    };
    return new FormGroup<FormVariableFormGroupContent>({
      id: new FormControl(
        { value: formVariableRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      sectionCode: new FormControl(formVariableRawValue.sectionCode, {
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      sectionName: new FormControl(formVariableRawValue.sectionName, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      formVariableType: new FormControl(formVariableRawValue.formVariableType, {
        validators: [Validators.required],
      }),
      orderIndex: new FormControl(formVariableRawValue.orderIndex, {
        validators: [Validators.required],
      }),
    });
  }

  getFormVariable(form: FormVariableFormGroup): IFormVariable | NewFormVariable {
    return form.getRawValue() as IFormVariable | NewFormVariable;
  }

  resetForm(form: FormVariableFormGroup, formVariable: FormVariableFormGroupInput): void {
    const formVariableRawValue = { ...this.getFormDefaults(), ...formVariable };
    form.reset(
      {
        ...formVariableRawValue,
        id: { value: formVariableRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FormVariableFormDefaults {
    return {
      id: null,
    };
  }
}
