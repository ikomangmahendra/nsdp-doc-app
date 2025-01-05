import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { FormVariableService } from '../service/form-variable.service';
import { IFormVariable } from '../form-variable.model';
import { FormVariableFormService } from './form-variable-form.service';

import { FormVariableUpdateComponent } from './form-variable-update.component';

describe('FormVariable Management Update Component', () => {
  let comp: FormVariableUpdateComponent;
  let fixture: ComponentFixture<FormVariableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formVariableFormService: FormVariableFormService;
  let formVariableService: FormVariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormVariableUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FormVariableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormVariableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formVariableFormService = TestBed.inject(FormVariableFormService);
    formVariableService = TestBed.inject(FormVariableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const formVariable: IFormVariable = { id: '4a0fa08c-3f7a-4f8b-b4e0-c5f6fba681dc' };

      activatedRoute.data = of({ formVariable });
      comp.ngOnInit();

      expect(comp.formVariable).toEqual(formVariable);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormVariable>>();
      const formVariable = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
      jest.spyOn(formVariableFormService, 'getFormVariable').mockReturnValue(formVariable);
      jest.spyOn(formVariableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formVariable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formVariable }));
      saveSubject.complete();

      // THEN
      expect(formVariableFormService.getFormVariable).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(formVariableService.update).toHaveBeenCalledWith(expect.objectContaining(formVariable));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormVariable>>();
      const formVariable = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
      jest.spyOn(formVariableFormService, 'getFormVariable').mockReturnValue({ id: null });
      jest.spyOn(formVariableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formVariable: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formVariable }));
      saveSubject.complete();

      // THEN
      expect(formVariableFormService.getFormVariable).toHaveBeenCalled();
      expect(formVariableService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormVariable>>();
      const formVariable = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
      jest.spyOn(formVariableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formVariable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formVariableService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
