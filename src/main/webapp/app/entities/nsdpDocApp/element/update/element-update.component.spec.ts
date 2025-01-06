import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPage } from 'app/entities/nsdpDocApp/page/page.model';
import { PageService } from 'app/entities/nsdpDocApp/page/service/page.service';
import { ElementService } from '../service/element.service';
import { IElement } from '../element.model';
import { ElementFormService } from './element-form.service';

import { ElementUpdateComponent } from './element-update.component';

describe('Element Management Update Component', () => {
  let comp: ElementUpdateComponent;
  let fixture: ComponentFixture<ElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let elementFormService: ElementFormService;
  let elementService: ElementService;
  let pageService: PageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ElementUpdateComponent],
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
      .overrideTemplate(ElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    elementFormService = TestBed.inject(ElementFormService);
    elementService = TestBed.inject(ElementService);
    pageService = TestBed.inject(PageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Page query and add missing value', () => {
      const element: IElement = { id: '8cb2adfb-085f-41da-aeeb-5dee8534d59b' };
      const page: IPage = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
      element.page = page;

      const pageCollection: IPage[] = [{ id: 'e64936f9-252c-4fb1-909a-37230addade4' }];
      jest.spyOn(pageService, 'query').mockReturnValue(of(new HttpResponse({ body: pageCollection })));
      const additionalPages = [page];
      const expectedCollection: IPage[] = [...additionalPages, ...pageCollection];
      jest.spyOn(pageService, 'addPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ element });
      comp.ngOnInit();

      expect(pageService.query).toHaveBeenCalled();
      expect(pageService.addPageToCollectionIfMissing).toHaveBeenCalledWith(
        pageCollection,
        ...additionalPages.map(expect.objectContaining),
      );
      expect(comp.pagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const element: IElement = { id: '8cb2adfb-085f-41da-aeeb-5dee8534d59b' };
      const page: IPage = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
      element.page = page;

      activatedRoute.data = of({ element });
      comp.ngOnInit();

      expect(comp.pagesSharedCollection).toContainEqual(page);
      expect(comp.element).toEqual(element);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IElement>>();
      const element = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
      jest.spyOn(elementFormService, 'getElement').mockReturnValue(element);
      jest.spyOn(elementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: element }));
      saveSubject.complete();

      // THEN
      expect(elementFormService.getElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(elementService.update).toHaveBeenCalledWith(expect.objectContaining(element));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IElement>>();
      const element = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
      jest.spyOn(elementFormService, 'getElement').mockReturnValue({ id: null });
      jest.spyOn(elementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: element }));
      saveSubject.complete();

      // THEN
      expect(elementFormService.getElement).toHaveBeenCalled();
      expect(elementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IElement>>();
      const element = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
      jest.spyOn(elementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ element });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(elementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePage', () => {
      it('Should forward to pageService', () => {
        const entity = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
        const entity2 = { id: 'e3b81fd5-d26c-42c8-9951-65debadc1c99' };
        jest.spyOn(pageService, 'comparePage');
        comp.comparePage(entity, entity2);
        expect(pageService.comparePage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
