import { IElement, NewElement } from './element.model';

export const sampleWithRequiredData: IElement = {
  id: 'acaa2a36-4f7c-4a00-b215-6e5e1b61e19b',
  type: 'till along unless',
  name: 'um bruised',
};

export const sampleWithPartialData: IElement = {
  id: '9783322b-5230-4f87-b767-e637b2f10598',
  type: 'yuck wallop',
  name: 'nervously upbeat',
};

export const sampleWithFullData: IElement = {
  id: '51ab7ea1-93ac-4031-a993-d08423270597',
  type: 'cripple incandescence',
  name: 'ouch optimistically oof',
};

export const sampleWithNewData: NewElement = {
  type: 'naturally whoever',
  name: 'shrilly ethyl devoted',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
