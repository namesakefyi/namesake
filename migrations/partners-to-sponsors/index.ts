import {defineMigration, at, set} from 'sanity/migrate'

const oldType = 'old'
const newType = 'new'

export default defineMigration({
  title: "partners-to-sponsors",
  documentTypes: ["partner"],

  migrate: {
    object(object, path, context) {
      if (object._type === oldType) {
        return at('_type', set(newType))
      }
    }
  }
})
