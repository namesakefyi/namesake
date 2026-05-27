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

## PDF Manager

All PDF management is done through the PDF Manager, an internal tool which can help add new PDFs and manage existing ones.

```zsh
pnpm pdf:manage
```

This opens the editor at `http://localhost:3456`.

### Keyboard navigation

| Keys | Action |
|------|--------|
| `↑` / `↓` | Navigate PDF list or field list |
| `Enter` | Open PDF / open field action menu |
| `Esc` | Go back / close menu without saving |

### What you can do

**Browse PDFs** — the sidebar lists all PDFs grouped by jurisdiction.

**Rename fields** — select a PDF, navigate to a field with `↑`/`↓`, press `Enter` to open the action menu, choose Rename, type the new name, press `Enter` to stage. Click Save or press `s` to write to disk and regenerate `schema.ts`.

**Delete fields** — same flow, choose Delete from the action menu.

**Add a new PDF** — Upload the PDF file, enter the form title, code (optional), and jurisdiction. Rename fields inline before creating. The editor generates `index.ts`, `schema.ts`, and a starter `index.test.ts`.

**Replace a PDF** — open an existing PDF and click "Upload New Version". Upload the new file; the editor regenerates `schema.ts` and shows which fields were added or removed.

---

## Wiring up a new PDF's resolver

After adding a PDF, open `src/pdfs/{jurisdiction}/{id}/index.ts`. Every field starts as `undefined` — map each one to a value from user-submitted form data (`src/constants/fields.ts`):

```ts
resolver: (data) => ({
  petitionerFirstName: data.oldFirstName,
  petitionerMiddleName: data.oldMiddleName,
  dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
  // Pre-printed court header — not driven by user data
  docketNumber: undefined,
})
```

Format helpers can be imported from `@/utils` (e.g. `formatDateMMDDYYYY`, `joinNames`). For fields that don't map to user data, leave them as `undefined`.

If no field definition exists in `src/constants/fields.ts`, add one.

## Writing tests

Every PDF definition should include a test that validates field rendering:

```ts
it("maps all fields correctly to the PDF", async () => {
  await expectPdfFieldsMatch(myPdf, testData);
});
```

Run tests:

```zsh
pnpm test path/to/pdf/index.test.ts
```

## Regenerating schema manually

If you ever edit a PDF outside the editor, regenerate all schemas with:

```zsh
pnpm pdf:schema
```
