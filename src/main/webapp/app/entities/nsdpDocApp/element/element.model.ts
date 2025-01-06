import { IPage } from 'app/entities/nsdpDocApp/page/page.model';

export interface IElement {
  id: string;
  type?: string | null;
  name?: string | null;
  page?: IPage | null;
}

export type NewElement = Omit<IElement, 'id'> & { id: null };
