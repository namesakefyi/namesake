import { createContext, useContext } from "react";

export interface FormSectionData {
  hash: string;
  title: string;
}

interface FormSectionContextType {
  sections: FormSectionData[];
}

export const FormSectionContext = createContext<FormSectionContextType>({
  sections: [],
});

export function useFormSections() {
  return useContext(FormSectionContext);
}
