# Forms

This directory contains all the blank PDFs that Namesake uses to fill forms, including schemas and tests for those forms.

## Naming and organization

Forms should be titled using all lowercase `kebab-case`. File names should begin with the form code, if one exists, followed by the full form title. For example, the form "Petition to Change Name of Adult" with the code "CJP 27" has the file name `cjp27-petition-to-change-name-of-adult.pdf`.

If the form code contains any spaces or hyphens, those should be omitted. For example, the form code "CJ-D 400" is `cjd400`. Together with the title "Probate and Family Court Motion", the file name is `cjd400-probate-and-family-court-motion.pdf`.

State-specific PDFs should be placed within a folder using the state's two-character abbreviation, like `/ma`. Federal forms, such as ones for Social Security or Passports, go in `/federal`.

## Defining PDF schemas

Each `.pdf` file should be accompanied by a `.ts` definition of the same name containing a single `default export`. For example:

```ts
// cjp27-petition-to-change-name-of-adult.ts
import { definePdf } from "@/utils/pdf";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";

export default definePdf({
  // Add title, optional code and jurisdiction, and
  // pass in the path to the pdf file
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  jurisdiction: "MA",
  pdfPath: pdf,

  // Add the field schema. Keys in the `data`
  // object should all be from USER_FORM_DATA_FIELDS.
  fields: (data: {
    oldFirstName: string;
    oldMiddleName: string;
    oldLastName: string;
    // ... Additional user form data
  }) => ({
    // The keys in the return object are the names
    // of the fields (as defined in the PDF).
    firstNameField: data.oldFirstName,
    middle_name_field: data.oldMiddleName,
    "Last Name Field": data.newLastName,
    // ... Additional field mappings
  });
});
```

## Renaming PDF fields and adding new fields

Sometimes original PDFs do not include form fields embedded within the PDF. Other PDFs do include form fields, but they are named poorly. In either case, you will want to make modifications to the PDF to add missing fields and name fields consistently.

To edit a PDF, download the original, then open it in the [Nutrient.io PDF Form Creator](https://www.nutrient.io/demo/pdf-form-creator). In the left sidebar, expand the "Create a Fillable Form" section, and it will allow you to add new form fields. Click on each field within the PDF to see a popover that allows you to rename it.

In general, it's good to name the fields so that they match the global constants for user form data. This will make mapping between the PDF field names and the names in our database much easier.

Once you have finished editing the PDF, click the download button in the top right, rename the file, and add it to the appropriate directory within `/src/forms`.

## Testing PDFs

Every PDF and definition should also include a test to validate that the form renders, checkboxes get checked, text fields get filled, etc.

Since we've already defined definitions for the data, this is pretty straightforward. Use `getPdfForm` to return a [PDFForm](https://pdf-lib.js.org/docs/api/classes/pdfform) object from `pdf-lib`, and then use methods like [getCheckBox](https://pdf-lib.js.org/docs/api/classes/pdfform#getcheckbox) and [getTextField](https://pdf-lib.js.org/docs/api/classes/pdfform#gettextfield) to test the values in the PDF.

Take extra care to test any conditional logic around checkboxes.

```ts
describe("CJP27 Petition to Change Name of Adult", () => {
  const testData = {
    newFirstName: "New",
    newMiddleName: "Newly",
    newLastName: "Name",
    oldFirstName: "Old",
    oldMiddleName: "Oldly",
    oldLastName: "Name",
    // More test data...
  } as const;

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: testData,
    });

    expect(form.getTextField("newFirstName").getText()).toBe("New");
    expect(form.getTextField("newMiddleName").getText()).toBe("Newly");
    expect(form.getTextField("newLastName").getText()).toBe("Name");

    // Test more fields...
  })
});
```