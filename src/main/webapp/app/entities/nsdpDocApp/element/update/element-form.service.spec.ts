import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../element.test-samples';

import { ElementFormService } from './element-form.service';

describe('Element Form Service', () => {
  let service: ElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementFormService);
  });

  describe('Service methods', () => {
    describe('createElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            name: expect.any(Object),
            page: expect.any(Object),
          }),
        );
      });

      it('passing IElement should create a new form with FormGroup', () => {
        const formGroup = service.createElementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            name: expect.any(Object),
            page: expect.any(Object),
          }),
        );
      });
    });

    describe('getElement', () => {
      it('should return NewElement for default Element initial value', () => {
        const formGroup = service.createElementFormGroup(sampleWithNewData);

        const element = service.getElement(formGroup) as any;

        expect(element).toMatchObject(sampleWithNewData);
      });

      it('should return NewElement for empty Element initial value', () => {
        const formGroup = service.createElementFormGroup();

        const element = service.getElement(formGroup) as any;

        expect(element).toMatchObject({});
      });

      it('should return IElement', () => {
        const formGroup = service.createElementFormGroup(sampleWithRequiredData);

        const element = service.getElement(formGroup) as any;

        expect(element).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IElement should not enable id FormControl', () => {
        const formGroup = service.createElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewElement should disable id FormControl', () => {
        const formGroup = service.createElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
