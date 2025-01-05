import { IFormVariable, NewFormVariable } from './form-variable.model';

export const sampleWithRequiredData: IFormVariable = {
  id: '48fa41f7-0465-4c8f-82e4-9fff36a1f4cb',
  sectionCode: 'during fib',
  sectionName: 'late coordinated',
  formVariableType: 'OUTCOME_ASSESSMENT',
  orderIndex: 27051,
};

export const sampleWithPartialData: IFormVariable = {
  id: '65a583aa-3c93-47a8-ab45-7795393c15ab',
  sectionCode: 'as',
  sectionName: 'vaguely buttery brr',
  formVariableType: 'OUTCOME_ASSESSMENT',
  orderIndex: 7733,
};

export const sampleWithFullData: IFormVariable = {
  id: 'd72fb28e-d6a0-4fa0-b18e-2b58ee3279c4',
  sectionCode: 'considerin',
  sectionName: 'once',
  formVariableType: 'OUTCOME_ASSESSMENT',
  orderIndex: 25204,
};

export const sampleWithNewData: NewFormVariable = {
  sectionCode: 'maestro',
  sectionName: 'instead',
  formVariableType: 'ACUTE',
  orderIndex: 16016,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
