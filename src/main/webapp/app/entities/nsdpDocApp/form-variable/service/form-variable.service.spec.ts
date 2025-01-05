import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IFormVariable } from '../form-variable.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../form-variable.test-samples';

import { FormVariableService } from './form-variable.service';

const requireRestSample: IFormVariable = {
  ...sampleWithRequiredData,
};

describe('FormVariable Service', () => {
  let service: FormVariableService;
  let httpMock: HttpTestingController;
  let expectedResult: IFormVariable | IFormVariable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(FormVariableService);
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

    it('should create a FormVariable', () => {
      const formVariable = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(formVariable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormVariable', () => {
      const formVariable = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(formVariable).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormVariable', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormVariable', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FormVariable', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFormVariableToCollectionIfMissing', () => {
      it('should add a FormVariable to an empty array', () => {
        const formVariable: IFormVariable = sampleWithRequiredData;
        expectedResult = service.addFormVariableToCollectionIfMissing([], formVariable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formVariable);
      });

      it('should not add a FormVariable to an array that contains it', () => {
        const formVariable: IFormVariable = sampleWithRequiredData;
        const formVariableCollection: IFormVariable[] = [
          {
            ...formVariable,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFormVariableToCollectionIfMissing(formVariableCollection, formVariable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormVariable to an array that doesn't contain it", () => {
        const formVariable: IFormVariable = sampleWithRequiredData;
        const formVariableCollection: IFormVariable[] = [sampleWithPartialData];
        expectedResult = service.addFormVariableToCollectionIfMissing(formVariableCollection, formVariable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formVariable);
      });

      it('should add only unique FormVariable to an array', () => {
        const formVariableArray: IFormVariable[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const formVariableCollection: IFormVariable[] = [sampleWithRequiredData];
        expectedResult = service.addFormVariableToCollectionIfMissing(formVariableCollection, ...formVariableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formVariable: IFormVariable = sampleWithRequiredData;
        const formVariable2: IFormVariable = sampleWithPartialData;
        expectedResult = service.addFormVariableToCollectionIfMissing([], formVariable, formVariable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formVariable);
        expect(expectedResult).toContain(formVariable2);
      });

      it('should accept null and undefined values', () => {
        const formVariable: IFormVariable = sampleWithRequiredData;
        expectedResult = service.addFormVariableToCollectionIfMissing([], null, formVariable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formVariable);
      });

      it('should return initial array if no FormVariable is added', () => {
        const formVariableCollection: IFormVariable[] = [sampleWithRequiredData];
        expectedResult = service.addFormVariableToCollectionIfMissing(formVariableCollection, undefined, null);
        expect(expectedResult).toEqual(formVariableCollection);
      });
    });

    describe('compareFormVariable', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFormVariable(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
        const entity2 = null;

        const compareResult1 = service.compareFormVariable(entity1, entity2);
        const compareResult2 = service.compareFormVariable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
        const entity2 = { id: '4a0fa08c-3f7a-4f8b-b4e0-c5f6fba681dc' };

        const compareResult1 = service.compareFormVariable(entity1, entity2);
        const compareResult2 = service.compareFormVariable(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };
        const entity2 = { id: 'd17b9784-cf57-4e0f-ad62-b7e9591106d7' };

        const compareResult1 = service.compareFormVariable(entity1, entity2);
        const compareResult2 = service.compareFormVariable(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
