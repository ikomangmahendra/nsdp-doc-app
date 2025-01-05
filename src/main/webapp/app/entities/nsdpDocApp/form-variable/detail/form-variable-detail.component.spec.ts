import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { FormVariableDetailComponent } from './form-variable-detail.component';

describe('FormVariable Management Detail Component', () => {
  let comp: FormVariableDetailComponent;
  let fixture: ComponentFixture<FormVariableDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormVariableDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./form-variable-detail.component').then(m => m.FormVariableDetailComponent),
              resolve: { formVariable: () => of({ id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FormVariableDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVariableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formVariable on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FormVariableDetailComponent);

      // THEN
      expect(instance.formVariable()).toEqual(expect.objectContaining({ id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
