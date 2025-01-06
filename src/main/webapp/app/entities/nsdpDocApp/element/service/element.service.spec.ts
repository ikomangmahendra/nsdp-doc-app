import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IElement } from '../element.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../element.test-samples';

import { ElementService } from './element.service';

const requireRestSample: IElement = {
  ...sampleWithRequiredData,
};

describe('Element Service', () => {
  let service: ElementService;
  let httpMock: HttpTestingController;
  let expectedResult: IElement | IElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ElementService);
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

    it('should create a Element', () => {
      const element = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(element).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Element', () => {
      const element = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(element).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Element', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Element', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Element', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addElementToCollectionIfMissing', () => {
      it('should add a Element to an empty array', () => {
        const element: IElement = sampleWithRequiredData;
        expectedResult = service.addElementToCollectionIfMissing([], element);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(element);
      });

      it('should not add a Element to an array that contains it', () => {
        const element: IElement = sampleWithRequiredData;
        const elementCollection: IElement[] = [
          {
            ...element,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, element);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Element to an array that doesn't contain it", () => {
        const element: IElement = sampleWithRequiredData;
        const elementCollection: IElement[] = [sampleWithPartialData];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, element);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(element);
      });

      it('should add only unique Element to an array', () => {
        const elementArray: IElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const elementCollection: IElement[] = [sampleWithRequiredData];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, ...elementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const element: IElement = sampleWithRequiredData;
        const element2: IElement = sampleWithPartialData;
        expectedResult = service.addElementToCollectionIfMissing([], element, element2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(element);
        expect(expectedResult).toContain(element2);
      });

      it('should accept null and undefined values', () => {
        const element: IElement = sampleWithRequiredData;
        expectedResult = service.addElementToCollectionIfMissing([], null, element, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(element);
      });

      it('should return initial array if no Element is added', () => {
        const elementCollection: IElement[] = [sampleWithRequiredData];
        expectedResult = service.addElementToCollectionIfMissing(elementCollection, undefined, null);
        expect(expectedResult).toEqual(elementCollection);
      });
    });

    describe('compareElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
        const entity2 = null;

        const compareResult1 = service.compareElement(entity1, entity2);
        const compareResult2 = service.compareElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
        const entity2 = { id: '8cb2adfb-085f-41da-aeeb-5dee8534d59b' };

        const compareResult1 = service.compareElement(entity1, entity2);
        const compareResult2 = service.compareElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };
        const entity2 = { id: '8cd2b31b-3aa0-4194-aa9c-90c364575ddb' };

        const compareResult1 = service.compareElement(entity1, entity2);
        const compareResult2 = service.compareElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
