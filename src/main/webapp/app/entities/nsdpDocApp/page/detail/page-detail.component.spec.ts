import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PageDetailComponent } from './page-detail.component';

describe('Page Management Detail Component', () => {
  let comp: PageDetailComponent;
  let fixture: ComponentFixture<PageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./page-detail.component').then(m => m.PageDetailComponent),
              resolve: { page: () => of({ id: 'e64936f9-252c-4fb1-909a-37230addade4' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PageDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load page on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PageDetailComponent);

      // THEN
      expect(instance.page()).toEqual(expect.objectContaining({ id: 'e64936f9-252c-4fb1-909a-37230addade4' }));
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
