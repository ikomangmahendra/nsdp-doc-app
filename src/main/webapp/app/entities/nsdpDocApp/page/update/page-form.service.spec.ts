import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../page.test-samples';

import { PageFormService } from './page-form.service';

describe('Page Form Service', () => {
  let service: PageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageFormService);
  });

  describe('Service methods', () => {
    describe('createPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            title: expect.any(Object),
            section: expect.any(Object),
          }),
        );
      });

      it('passing IPage should create a new form with FormGroup', () => {
        const formGroup = service.createPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            title: expect.any(Object),
            section: expect.any(Object),
          }),
        );
      });
    });

    describe('getPage', () => {
      it('should return NewPage for default Page initial value', () => {
        const formGroup = service.createPageFormGroup(sampleWithNewData);

        const page = service.getPage(formGroup) as any;

        expect(page).toMatchObject(sampleWithNewData);
      });

      it('should return NewPage for empty Page initial value', () => {
        const formGroup = service.createPageFormGroup();

        const page = service.getPage(formGroup) as any;

        expect(page).toMatchObject({});
      });

      it('should return IPage', () => {
        const formGroup = service.createPageFormGroup(sampleWithRequiredData);

        const page = service.getPage(formGroup) as any;

        expect(page).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPage should not enable id FormControl', () => {
        const formGroup = service.createPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPage should disable id FormControl', () => {
        const formGroup = service.createPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
