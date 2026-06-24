export interface Field {
  name: string;
  type: "text" | "checkbox" | "radio";
  excluded?: boolean;
}

export interface PdfMeta {
  id: string;
  title: string;
  code: string;
  jurisdiction: string;
  canonicalUrl: string;
  fieldCount: number;
}

export interface Jurisdiction {
  name: string;
  abbreviation: string;
}

export interface Diff {
  added: string[];
  removed: string[];
  unchanged?: string[];
  fieldCount?: number;
  error?: string;
}

export interface FieldPreview {
  newFields: Field[];
  retained: string[];
  added: string[];
  removed: string[];
  autoMappings: Record<string, string>;
  error?: string;
}

export interface Rename {
  from: string;
  to: string;
}

export interface AddPdfResult {
  id: string;
  fieldCount: number;
  error?: string;
}
