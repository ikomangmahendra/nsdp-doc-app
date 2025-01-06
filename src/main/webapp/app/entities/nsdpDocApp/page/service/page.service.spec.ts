import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPage } from '../page.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../page.test-samples';

import { PageService } from './page.service';

const requireRestSample: IPage = {
  ...sampleWithRequiredData,
};

describe('Page Service', () => {
  let service: PageService;
  let httpMock: HttpTestingController;
  let expectedResult: IPage | IPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Page', () => {
      const page = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(page).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Page', () => {
      const page = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(page).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Page', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Page', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Page', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPageToCollectionIfMissing', () => {
      it('should add a Page to an empty array', () => {
        const page: IPage = sampleWithRequiredData;
        expectedResult = service.addPageToCollectionIfMissing([], page);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(page);
      });

      it('should not add a Page to an array that contains it', () => {
        const page: IPage = sampleWithRequiredData;
        const pageCollection: IPage[] = [
          {
            ...page,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPageToCollectionIfMissing(pageCollection, page);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Page to an array that doesn't contain it", () => {
        const page: IPage = sampleWithRequiredData;
        const pageCollection: IPage[] = [sampleWithPartialData];
        expectedResult = service.addPageToCollectionIfMissing(pageCollection, page);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(page);
      });

      it('should add only unique Page to an array', () => {
        const pageArray: IPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pageCollection: IPage[] = [sampleWithRequiredData];
        expectedResult = service.addPageToCollectionIfMissing(pageCollection, ...pageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const page: IPage = sampleWithRequiredData;
        const page2: IPage = sampleWithPartialData;
        expectedResult = service.addPageToCollectionIfMissing([], page, page2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(page);
        expect(expectedResult).toContain(page2);
      });

      it('should accept null and undefined values', () => {
        const page: IPage = sampleWithRequiredData;
        expectedResult = service.addPageToCollectionIfMissing([], null, page, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(page);
      });

      it('should return initial array if no Page is added', () => {
        const pageCollection: IPage[] = [sampleWithRequiredData];
        expectedResult = service.addPageToCollectionIfMissing(pageCollection, undefined, null);
        expect(expectedResult).toEqual(pageCollection);
      });
    });

    describe('comparePage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
        const entity2 = null;

        const compareResult1 = service.comparePage(entity1, entity2);
        const compareResult2 = service.comparePage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
        const entity2 = { id: 'e3b81fd5-d26c-42c8-9951-65debadc1c99' };

        const compareResult1 = service.comparePage(entity1, entity2);
        const compareResult2 = service.comparePage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };
        const entity2 = { id: 'e64936f9-252c-4fb1-909a-37230addade4' };

        const compareResult1 = service.comparePage(entity1, entity2);
        const compareResult2 = service.comparePage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
