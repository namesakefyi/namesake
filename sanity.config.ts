import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  authorType,
  categoryType,
  contactType,
  formType,
  guideType,
  pageType,
  postType,
  pressType,
  sponsorType,
  stateType,
} from "./src/sanity/schema";

export default defineConfig({
  name: "namesake",
  title: "Namesake",
  projectId: "k4p1j15y",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [
      authorType,
      categoryType,
      contactType,
      formType,
      guideType,
      pageType,
      postType,
      pressType,
      sponsorType,
      stateType,
    ],
  },
});
