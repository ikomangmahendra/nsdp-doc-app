import { FormVariableType } from 'app/entities/enumerations/form-variable-type.model';

export interface IFormVariable {
  id: string;
  sectionCode?: string | null;
  sectionName?: string | null;
  formVariableType?: keyof typeof FormVariableType | null;
  orderIndex?: number | null;
}

export type NewFormVariable = Omit<IFormVariable, 'id'> & { id: null };
