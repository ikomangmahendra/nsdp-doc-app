import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISection, NewSection } from '../section.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISection for edit and NewSectionFormGroupInput for create.
 */
type SectionFormGroupInput = ISection | PartialWithRequiredKeyOf<NewSection>;

type SectionFormDefaults = Pick<NewSection, 'id'>;

type SectionFormGroupContent = {
  id: FormControl<ISection['id'] | NewSection['id']>;
  sectionCode: FormControl<ISection['sectionCode']>;
  sectionName: FormControl<ISection['sectionName']>;
  orderIndex: FormControl<ISection['orderIndex']>;
};

export type SectionFormGroup = FormGroup<SectionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SectionFormService {
  createSectionFormGroup(section: SectionFormGroupInput = { id: null }): SectionFormGroup {
    const sectionRawValue = {
      ...this.getFormDefaults(),
      ...section,
    };
    return new FormGroup<SectionFormGroupContent>({
      id: new FormControl(
        { value: sectionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      sectionCode: new FormControl(sectionRawValue.sectionCode, {
        validators: [Validators.required],
      }),
      sectionName: new FormControl(sectionRawValue.sectionName, {
        validators: [Validators.required],
      }),
      orderIndex: new FormControl(sectionRawValue.orderIndex, {
        validators: [Validators.required],
      }),
    });
  }

  getSection(form: SectionFormGroup): ISection | NewSection {
    return form.getRawValue() as ISection | NewSection;
  }

  resetForm(form: SectionFormGroup, section: SectionFormGroupInput): void {
    const sectionRawValue = { ...this.getFormDefaults(), ...section };
    form.reset(
      {
        ...sectionRawValue,
        id: { value: sectionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SectionFormDefaults {
    return {
      id: null,
    };
  }
}
