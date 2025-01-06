import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISection } from 'app/entities/nsdpDocApp/section/section.model';
import { SectionService } from 'app/entities/nsdpDocApp/section/service/section.service';
import { PageService } from '../service/page.service';
import { IPage } from '../page.model';
import { PageFormService } from './page-form.service';

import { PageUpdateComponent } from './page-update.component';

describe('Page Management Update Component', () => {
  let comp: PageUpdateComponent;
  let fixture: ComponentFixture<PageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pageFormService: PageFormService;
  let pageService: PageService;
  let sectionService: SectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageUpdateComponent],
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
      .overrideTemplate(PageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pageFormService = TestBed.inject(PageFormService);
    pageService = TestBed.inject(PageService);
    sectionService = TestBed.inject(SectionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Section query and add missing value', () => {
      const page: IPage = { id: 'e3b81fd5-d26c-42c8-9951-65debadc1c99' };
      const section: ISection = { id: '682b002b-db5c-422d-8e5a-8b1b60f2decf' };
      page.section = section;

      const sectionCollection: ISection[] = [{ id: '682b002b-db5c-422d-8e5a-8b1b60f2decf' }];
      jest.spyOn(sectionService, 'query').mockReturnValue(of(new HttpResponse({ body: sectionCollection })));
      const additionalSections = [section];
      const expectedCollection: ISection[] = [...additionalSections, ...sectionCollection];
      jest.spyOn(sectionService, 'addSectionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ page });
      comp.ngOnInit();

      expect(sectionService.query).toHaveBeenCalled();
      expect(sectionService.addSectionToCollectionIfMissing).toHaveBeenCalledWith(
        sectionCollection,
        ...additionalSections.map(expect.objectContaining),
      );
      expect(comp.sectionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const page: IPage = { id: 'e3b81fd5-d26c-42c8-9951-65debadc1c99' };
      const section: ISection = { id: '682b002b-db5c-422d-8e5a-8b1b60f2decf' };
      page.section = section;

      activatedRoute.data = of({ page });
      comp.ngOnInit();

      expect(comp.sectionsSharedCollection).toContainEqual(section);
      expect(comp.page).toEqual(page);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPage>>();
      const page = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
      jest.spyOn(pageFormService, 'getPage').mockReturnValue(page);
      jest.spyOn(pageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ page });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: page }));
      saveSubject.complete();

      // THEN
      expect(pageFormService.getPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pageService.update).toHaveBeenCalledWith(expect.objectContaining(page));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPage>>();
      const page = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
      jest.spyOn(pageFormService, 'getPage').mockReturnValue({ id: null });
      jest.spyOn(pageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ page: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: page }));
      saveSubject.complete();

      // THEN
      expect(pageFormService.getPage).toHaveBeenCalled();
      expect(pageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPage>>();
      const page = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
      jest.spyOn(pageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ page });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSection', () => {
      it('Should forward to sectionService', () => {
        const entity = { id: '682b002b-db5c-422d-8e5a-8b1b60f2decf' };
        const entity2 = { id: '4465a596-1b29-45d8-93ab-ee4274ad08a4' };
        jest.spyOn(sectionService, 'compareSection');
        comp.compareSection(entity, entity2);
        expect(sectionService.compareSection).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
