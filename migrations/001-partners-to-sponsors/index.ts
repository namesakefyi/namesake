import { at, defineMigration, set } from "sanity/migrate";

const oldType = "partner";
const newType = "sponsor";

export default defineMigration({
  title: "Rename partners to sponsors",
  documentTypes: ["partner"],

  migrate: {
    object(object) {
      if (object._type === oldType) {
        return at("_type", set(newType));
      }
    },
  },
});
