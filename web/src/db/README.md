# IndexedDB

Namesake uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to store form data locally in the user's browser. No form data is sent to a server. The [`idb`](https://github.com/jakearchibald/idb) library provides a Promise-based wrapper around the native IndexedDB API.

## Stores

The database is named `"namesake"` and contains two object stores:

| Store | Key | Purpose |
|---|---|---|
| `formData` | `field` | Stores each form field's saved value |
| `formProgress` | `formSlug` | Stores each form's current XState machine state |

## How migrations work

Every schema change is a numbered migration file in `migrations/`. Each file exports a single `migration` function that receives the database and the current upgrade transaction.

When the app opens the database, `getDB()` in `init.ts` compares the stored version against `DB_VERSION`. If they differ, it runs every migration between the old version and the new one in order:

```ts
for (let v = oldVersion; v < newVersion; v++) {
  migrations[v]?.(db, transaction);
}
```

Each migration is responsible for a single step — adding a store, renaming one, etc. Migrations must be **idempotent**: they check whether the target state already exists before making changes.

## Adding a migration

Run the generator to scaffold all the boilerplate at once:

```bash
pnpm idb:add-migration <kebab-case-name>
```

For example, `pnpm idb:add-migration add-documents-store` will:

- Create `migrations/NNN-add-documents-store.ts` with a stub `migration` function
- Create `migrations/__tests__/NNN-add-documents-store.test.ts` with test stubs
- Register the migration in `migrations/index.ts`
- Bump `DB_VERSION` in `init.ts`

After running the script:

1. Implement the migration in the generated `.ts` file
2. Update `NamesakeDBSchema` in `types.ts` if you added or removed a store
3. Fill in the test stubs in the generated `.test.ts` file

## Testing

Migration tests use [`fake-indexeddb`](https://github.com/dumbmatter/fakeIndexedDB) to simulate IndexedDB in Node.

```bash
pnpm test src/db
```

**`migrations/__tests__/index.test.ts`** contains two kinds of tests:

- **CI invariant** — fails if `DB_VERSION` and the `migrations` array length fall out of sync, catching the most common mistake when adding a migration.
- **Upgrade path tests** — run through `getDB()` to verify the full pipeline end-to-end (correct ordering, real starting states, known regressions).

**Per-migration test files** (`001-*.test.ts`, `002-*.test.ts`, …) test each migration function in isolation using `runMockMigration` from `test-utils.ts`.
