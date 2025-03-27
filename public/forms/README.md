# Forms

This directory contains all the blank PDFs that Namesake uses to fill forms.

## Naming and organization

Forms should be titled using all lowercase `kebab-case`. File names should begin with the form code, if one exists, followed by the full form title. For example, the form "Petition to Change Name of Adult" with the code "CJP 34" has the file name `cjp34-petition-to-change-name-of-adult.pdf`.

If the form code contains any spaces or hyphens, those should be omitted. For example, the form code "CJ-D 400" is `cjd400`. Together with the title "Probate and Family Court Motion", the file name is `cjd400-probate-and-family-court-motion.pdf`.

State-specific PDFs should be placed within a folder using the state's two-character abbreviation, like `/ma`. Federal forms, such as ones for Social Security or Passports, go in `/federal`.

## Defining form data

Each `.pdf` file should be accompanied by a `.ts` definition of the same name containing a single `default export`. For example:

```ts
import { definePdf } from "@/utils/pdf";

export default definePdf({
  // Add the title of the form
  title: "Petition to Change Name of Adult",

  // Add the form code, if one exists
  code: "CJP 27",

  // Add a path to the pdf (from /public)
  pdfPath: "/forms/ma/cjp27-petition-to-change-name-of-adult.pdf",

  // Add the two-letter state abbreviation (if applicable for form)
  jurisdiction: "MA",

  // Add the field schema. Fields takes in a `data` object
  // which should contain basic types and use names defined
  // in the global USER_FORM_DATA_FIELDS const.
  fields: (data: {
    oldFirstName: string;
    oldMiddleName: string;
    oldLastName: string;
    // ... Additional user form data
  }) => ({
    // Fields should return an object that maps field names from the PDF
    // form to the appropriate user data. These names from the PDF are
    // often inconsistent or strange. Examples: "Language_Checkbox",
    // "another_name_yes", "First Name". For more about finding PDF field
    // names, see "Extracting Field Names from PDFs" below.
    "First Name": data.oldFirstName,
    "Middle Name": data.oldMiddleName,
    "Last Name": data.newLastName,
    
    // ... Additional field mappings
  });
});
```

### Extracting field names from PDFs

1. Install [qpdf](https://qpdf.readthedocs.io/en/stable/index.html).

```bash
brew install qpdf
```

If you don't already have [Homebrew](https://brew.sh/) installed, you will need to install that first.

2. Navigate to the directory where your .pdf is stored and run:

```bash
qpdf inout.pdf --json | jq '.acroform.fields'
```

3. You should get a list that looks like this. We're interested in the `"fullname"` field. The value of this field (in this example, `"CityTown_3"`) is the key we'll use to map our values to the PDF.

```jsonc
{
    "alternativename": "City/Town",
    "annotation": {
      "annotationflags": 4,
      "appearancestate": "",
      "object": "25 0 R"
    },
    "choices": [],
    "defaultvalue": null,
    "fieldflags": 0,
    "fieldtype": "/Tx",
    "fullname": "CityTown_3",
    "ischeckbox": false,
    "ischoice": false,
    "isradiobutton": false,
    "istext": true,
    "mappingname": "City/Town",
    "object": "25 0 R",
    "pageposfrom1": 1,
    "parent": null,
    "partialname": "CityTown_3",
    "quadding": 0,
    "value": "u:"
  },
  {
    // More objects ...
  }
```

The "fullname" keys must be entered **exactly** as written (casing and spacing included). PDFs!

## Missing fields

If a downloaded form is missing fill-out-able fields (partially or fully), here's what to do.