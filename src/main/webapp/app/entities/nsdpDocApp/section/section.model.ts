export interface ISection {
  id: string;
  sectionCode?: string | null;
  sectionName?: string | null;
  orderIndex?: number | null;
}

export type NewSection = Omit<ISection, 'id'> & { id: null };
