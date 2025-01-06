import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ElementDetailComponent } from './element-detail.component';

describe('Element Management Detail Component', () => {
  let comp: ElementDetailComponent;
  let fixture: ComponentFixture<ElementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./element-detail.component').then(m => m.ElementDetailComponent),
              resolve: { element: () => of({ id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ElementDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load element on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ElementDetailComponent);

      // THEN
      expect(instance.element()).toEqual(expect.objectContaining({ id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' }));
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
