import { createContext, useContext } from "react";

export interface FormSection {
  hash: string;
  title: string;
}

interface FormSectionContextType {
  sections: FormSection[];
}

export const FormSectionContext = createContext<FormSectionContextType>({
  sections: [],
});

export function useFormSections() {
  return useContext(FormSectionContext);
}
