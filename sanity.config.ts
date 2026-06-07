import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  categoryType,
  contactType,
  formType,
  guideType,
  stateType,
} from "./src/sanity/schema";

export default defineConfig({
  name: "namesake",
  title: "Namesake",
  projectId: "k4p1j15y",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [categoryType, contactType, formType, guideType, stateType],
  },
});
