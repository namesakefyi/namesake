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

---

## Adding a new PDF

### Step 1: Upload via the PDF Manager

Start the PDF Manager:

```zsh
pnpm pdf:manage
```

This opens the editor at `http://localhost:3456`. Click **Add PDF**, upload the file, and fill in:

- **Form title** — e.g. "Petition to Change Name of Adult"
- **Form code** (optional) — e.g. "CJP-27"
- **Jurisdiction** — Federal or a state (MA, NY, etc.)

The manager copies the PDF into the correct folder, strips any default field borders and backgrounds, and generates `index.ts`, `schema.ts`, and a starter `index.test.ts`.

### Step 2: Rename fields

Raw PDFs from .gov sites often have vague, sentence-length, or internal field names ("form1[0].BodyPage1[0].S1[0].Ln[0]"). Select a field in the list and press `Enter` (or double-click) to rename it. The PDF preview highlights the current field so you can see it in context.

Field naming conventions:

1. Use `camelCase` — e.g. `residenceStreetAddress`, `newFirstName`.
2. Prefix checkbox fields with `is`, `should`, or `has` — e.g. `isReceivingMedicaid`, `shouldReturnOriginalDocuments`.
   - If a question has a separate "Yes" and "No" checkbox, add the suffix `True` / `False` — e.g. `hasPreviousNameChangeTrue` and `hasPreviousNameChangeFalse`.
3. Try to match [existing field definitions](../constants/fields.ts). Exact matches aren't required, but staying close makes wiring easier.
4. Don't shorten a name if it needs to be specific — long is fine.

To delete a field entirely, select it and press `Delete` or `Backspace`. Hold `Shift` to select multiple fields and delete them all at once. Click **Save** to write all renames and deletions to disk and regenerate `schema.ts`.

### Step 3: Map PDF fields to form data

Open `src/pdfs/{jurisdiction}/{id}/index.ts`. Every field starts as `undefined` — map each one to a value from user-submitted form data (`src/constants/fields.ts`):

```ts
resolver: (data) => ({
  petitionerFirstName: data.oldFirstName,
  petitionerMiddleName: data.oldMiddleName,
  petitionerLastName: data.oldLastName,
  dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
  // etc.
})
```

For each PDF field, find a matching FIELD_DEF by name. Use it directly or derive a value. Format helpers can be imported from `@/utils` to concatenate a full name, join pronouns, or format a date.

For fields that don't correspond to user data (pre-printed court headers, fields intentionally left blank), leave them as `undefined`:

```ts
resolver: (data) => ({
  petitionerFirstName: data.oldFirstName,
  // Pre-printed court header — not driven by user data
  docketNumber: undefined,
})
```

TypeScript will error if any schema field is missing from the resolver. If no FIELD_DEF exists for a PDF field, add one to `src/constants/fields.ts`.

Do not worry about complex conditional logic for data when wiring up the PDF resolver (e.g. only fill out field 4a. if field 4 is true) — that logic is handled elsewhere. Simply map PDF field names to data names.

### Step 4: Write tests

Every PDF definition should include a test that validates field rendering. Use `expectPdfFieldsMatch` to verify the base set of data, then add focused tests for any derived or conditional values:

```ts
import { describe, it } from "vitest";
import type { FormData } from "@/constants/fields";
import { expectPdfFieldsMatch } from "@/pdfs/utils/expectPdfFieldsMatch";
import myPdf from ".";

describe("My Form", () => {
  const testData: Partial<FormData> = {
    newFirstName: "Eva",
    // ... all relevant fields
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(myPdf, testData);
  });
});
```

Run tests:

```zsh
pnpm test path/to/pdf/index.test.ts
```

Then open a pull request. You've added a new PDF definition to Namesake!

---

## Replacing an existing PDF

When a revised version of a PDF is published (e.g. a new revision on a .gov site), open the PDF Manager and select the existing PDF. Click **New Revision** and upload the new file.

The manager compares the new field names against the existing schema and presents a diff:

- **Unchanged fields** — retained automatically, no action needed.
- **Renamed fields** — the manager suggests matches using fuzzy name similarity; confirm or adjust each one.
- **New fields** — type a name or pick a suggestion to map them to existing schema fields.
- **Removed fields** — any old field name not claimed by a new field must be explicitly removed.

Once all old field names are accounted for, click **Replace**. The manager writes the new PDF to disk, applies all renames and deletions, and regenerates `schema.ts`. Update `index.ts` and `index.test.ts` to reflect any new or removed fields.

### Keyboard shortcuts

| Keys | Action |
|------|--------|
| `↑` / `↓` | Navigate the field list |
| `Enter` | Rename selected field |
| `Delete` / `Backspace` | Mark selected field(s) for deletion |
| `Shift+click` | Multi-select fields |
| `Cmd+Z` / `Ctrl+Z` | Undo last change |
| `Esc` | Cancel / close without saving |

---

## Regenerating the schema manually

If you edit a PDF outside the manager, regenerate all schemas with:

```zsh
pnpm pdf:schema
```
