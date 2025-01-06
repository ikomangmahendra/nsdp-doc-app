import { IPage, NewPage } from './page.model';

export const sampleWithRequiredData: IPage = {
  id: 'd3c31a99-d3b5-4eff-88b1-797469313055',
  name: 'tensely',
  title: 'sock hungry frenetically',
};

export const sampleWithPartialData: IPage = {
  id: '42fe8986-faaf-4739-8811-fde05d912842',
  name: 'beyond vanish',
  title: 'phew quickly qua',
};

export const sampleWithFullData: IPage = {
  id: 'b4411b88-ab4e-45a8-b616-3bc015cadb12',
  name: 'especially from now',
  title: 'failing',
};

export const sampleWithNewData: NewPage = {
  name: 'nicely ouch stylish',
  title: 'trust',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
