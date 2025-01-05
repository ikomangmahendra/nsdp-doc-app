import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../form-variable.test-samples';

import { FormVariableFormService } from './form-variable-form.service';

describe('FormVariable Form Service', () => {
  let service: FormVariableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormVariableFormService);
  });

  describe('Service methods', () => {
    describe('createFormVariableFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFormVariableFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sectionCode: expect.any(Object),
            sectionName: expect.any(Object),
            formVariableType: expect.any(Object),
            orderIndex: expect.any(Object),
          }),
        );
      });

      it('passing IFormVariable should create a new form with FormGroup', () => {
        const formGroup = service.createFormVariableFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sectionCode: expect.any(Object),
            sectionName: expect.any(Object),
            formVariableType: expect.any(Object),
            orderIndex: expect.any(Object),
          }),
        );
      });
    });

    describe('getFormVariable', () => {
      it('should return NewFormVariable for default FormVariable initial value', () => {
        const formGroup = service.createFormVariableFormGroup(sampleWithNewData);

        const formVariable = service.getFormVariable(formGroup) as any;

        expect(formVariable).toMatchObject(sampleWithNewData);
      });

      it('should return NewFormVariable for empty FormVariable initial value', () => {
        const formGroup = service.createFormVariableFormGroup();

        const formVariable = service.getFormVariable(formGroup) as any;

        expect(formVariable).toMatchObject({});
      });

      it('should return IFormVariable', () => {
        const formGroup = service.createFormVariableFormGroup(sampleWithRequiredData);

        const formVariable = service.getFormVariable(formGroup) as any;

        expect(formVariable).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFormVariable should not enable id FormControl', () => {
        const formGroup = service.createFormVariableFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFormVariable should disable id FormControl', () => {
        const formGroup = service.createFormVariableFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
