import { ISection } from 'app/entities/nsdpDocApp/section/section.model';

export interface IPage {
  id: string;
  name?: string | null;
  title?: string | null;
  section?: ISection | null;
}

export type NewPage = Omit<IPage, 'id'> & { id: null };
