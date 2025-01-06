import { ISection, NewSection } from './section.model';

export const sampleWithRequiredData: ISection = {
  id: 'e83ca48d-30f9-46b8-9e2f-74262a1c3684',
  sectionCode: 'gee oxidise while',
  sectionName: 'linseed infatuated fowl',
  orderIndex: 20393,
};

export const sampleWithPartialData: ISection = {
  id: 'e3986e4f-9dc1-4d6a-9377-da677e131120',
  sectionCode: 'feline',
  sectionName: 'yet yowza besides',
  orderIndex: 7948,
};

export const sampleWithFullData: ISection = {
  id: 'cdb92d17-7a7b-4fed-9023-9af75b1ee162',
  sectionCode: 'wriggler knottily drat',
  sectionName: 'meh oh shameless',
  orderIndex: 2572,
};

export const sampleWithNewData: NewSection = {
  sectionCode: 'but as',
  sectionName: 'glossy',
  orderIndex: 6516,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
