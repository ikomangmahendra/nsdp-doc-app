import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPage, NewPage } from '../page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPage for edit and NewPageFormGroupInput for create.
 */
type PageFormGroupInput = IPage | PartialWithRequiredKeyOf<NewPage>;

type PageFormDefaults = Pick<NewPage, 'id'>;

type PageFormGroupContent = {
  id: FormControl<IPage['id'] | NewPage['id']>;
  name: FormControl<IPage['name']>;
  title: FormControl<IPage['title']>;
  section: FormControl<IPage['section']>;
};

export type PageFormGroup = FormGroup<PageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PageFormService {
  createPageFormGroup(page: PageFormGroupInput = { id: null }): PageFormGroup {
    const pageRawValue = {
      ...this.getFormDefaults(),
      ...page,
    };
    return new FormGroup<PageFormGroupContent>({
      id: new FormControl(
        { value: pageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(pageRawValue.name, {
        validators: [Validators.required],
      }),
      title: new FormControl(pageRawValue.title, {
        validators: [Validators.required],
      }),
      section: new FormControl(pageRawValue.section),
    });
  }

  getPage(form: PageFormGroup): IPage | NewPage {
    return form.getRawValue() as IPage | NewPage;
  }

  resetForm(form: PageFormGroup, page: PageFormGroupInput): void {
    const pageRawValue = { ...this.getFormDefaults(), ...page };
    form.reset(
      {
        ...pageRawValue,
        id: { value: pageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PageFormDefaults {
    return {
      id: null,
    };
  }
}
