# PDFs

This directory contains all the blank PDFs that Namesake uses to fill forms, including schemas and tests for those PDFs.

## Naming and organization

Each PDF has its own folder under a jurisdiction (`ma`, `federal`, `ny`). The folder name is the PDF id in `kebab-case`. For example:

```
src/pdfs/
  ma/
    cjp27-petition-to-change-name-of-adult/
      cjp27-petition-to-change-name-of-adult.pdf
      index.ts           # typed PDF definition
      index.test.ts      # PDF definition test
      schema.ts          # auto-generated form schema
```

## Adding new PDFs

### Step 1: Review and rename fields

Use the [BentoPDF Form Creator](https://bentopdf.com/form-creator.html). Upload the original PDF form that was downloaded.

Examine the names of all fields in the form. These names are what we use to map user submissions from Namesake forms to the final output in the completed PDF. Often, the raw PDF from a .gov site has field names that are vague ("type"), full sentences ("[A] I receive assistance from ..."), meaningless internal markers ("form1[0].BodyPage1[0].S1[0].Ln[0]"), or a mix of all three.

Sometimes, interactive fields will be missing altogether. In this case, you'll need to insert new text fields and checkbox fields, then position and name them.

When naming:

1. Use `camelCase` for all fields, like `residenceStreetAddress` or `newFirstName`.
2. Prefix checkbox fields with `is`, `should`, or `has`. For example, `isReceivingMedicaid` or `shouldReturnOriginalDocuments`.
   - If there are two separate checkboxes representing the same boolean value (such as a "Yes" and "No" checkbox for the same question), you can add the suffix `True` and `False`. For example, `hasPreviousNameChangeTrue` and `hasPreviousNameChangeFalse`.
3. Try to match the list of [existing field definitions](../constants/fields.ts). Nothing needs to *exactly* match, but keeping the names close will make the next step easier.
4. Don't hesitate to make a name long, if it needs to be; some of these form fields are very specific.

When all user-enterable fields have been labeled and positioned, download the modified PDF and save it anywhere.

### Step 2: Generate PDF definitions

Run the define script with the path to your modified PDF:

```zsh
pnpm pdf:define ./path/to/form.pdf
```

The path can be anywhere (e.g. Downloads, Desktop). The script will copy the PDF into the correct folder and generate `index.ts`, `schema.ts`, and a starter test file.

The script will prompt for:
- **Form title** — e.g. "Petition to Change Name of Adult"
- **Form code** (optional) — e.g. "CJP-27"
- **Jurisdiction** — Federal or a state (MA, NY, etc.)

### Step 3: Map PDF fields to form data

We've generated an `index.ts` file with all of our field definitions in a flat list. Right now, all those fields are `undefined`.

```ts
resolver: (data) => ({
  petitionerFirstName: undefined,
  petitionerMiddleName: undefined,
  petitionerLastName: undefined,
  dateOfBirth: undefined,
  // etc.
})
```

The resolver maps each PDF field name (left) to a value from user-submitted form data (right). Form data comes from [FIELD_DEFS](../constants/fields.ts).

```ts
resolver: (data) => ({
  petitionerFirstName: data.oldFirstName,
  petitionerMiddleName: data.oldMiddleName,
  petitionerLastName: data.oldLastName,
  dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
  // etc.
})
```

For each PDF field, look up a matching FIELD_DEF by name. Use it directly, or derive a value. Format helpers can be imported from `@/utils` to help concatenate a full name, join an array of pronouns, or format a date.

If no FIELD_DEF exists for a PDF field, add one to `src/constants/fields.ts`.

Every field in the schema must be present in the resolver — TypeScript will error if any are missing. For fields that don't correspond to user data (pre-printed form content, fields intentionally left blank), leave them as `undefined`:

```ts
resolver: (data) => ({
  petitionerFirstName: data.oldFirstName,
  // Pre-printed court header — not driven by user data
  docketNumber: undefined,
})
```

No conditional checks are needed in the PDF definition itself; that logic is handled elsewhere. Just map PDF field names to data names.

### Step 4: Write tests

Every PDF and definition should include a test to validate that the form renders, checkboxes get checked, text fields get filled, and derived values are correct.

Use `expectPdfFieldsMatch` to verify the base set of data. Other tests can then focus on testing derived values or other unique behavior.

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FormData } from "@/constants/fields";
import { expectPdfFieldsMatch } from "@/pdfs/utils/expectPdfFieldsMatch";
import { getPdfForm } from "@/pdfs/utils/getPdfForm";
import cjp25PetitionToChangeNameOfMinor from ".";

describe("Petition to Change Name of Minor", () => {
  afterEach(() => vi.useRealTimers());

  const testData: Partial<FormData> = {
    // Full test data for all fields...
  };

  // Verify that all fields render
  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(cjp25PetitionToChangeNameOfMinor, testData);
  });

  // Test derived logic
  it("derives isChildUnder12 from date of birth", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithOlderChild = {
      ...testData,
      dateOfBirth: "2012-01-01", // 13 years old — isChildUnder12 becomes false
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithOlderChild,
    });

    expect(form.getCheckBox("isChildUnder12").isChecked()).toBe(false);
  });
});
```

Run your tests:

```zsh
pnpm test path/to/pdf/index.test.ts
```

Then open a pull request. You've added a new PDF definition to Namesake!

## Regenerating schema.ts

If you modify a PDF file (e.g. in BentoPDF or another tool) to rename form fields, regenerate the schema:

```zsh
pnpm pdf:schema path/to/form.pdf
```

To regenerate schemas for all PDFs in `src/pdfs`, run without an argument:

```zsh
pnpm pdf:schema
```

## Removing form borders and backgrounds

PDF editors may insert default black borders and white backgrounds to text fields and checkboxes that you insert. To remove these styles and display transparent fields, run:

```zsh
pnpm pdf:clean path/to/form.pdf
```

Form fields are stripped of styles automatically during `pnpm pdf:define`.