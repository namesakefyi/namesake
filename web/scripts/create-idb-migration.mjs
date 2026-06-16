#!/usr/bin/env node
// Usage: pnpm idb:add-migration <kebab-case-name>
// Example: pnpm idb:add-migration add-index-to-form-data

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MIGRATIONS_DIR = join(ROOT, "src/db/migrations");
const MIGRATIONS_INDEX = join(MIGRATIONS_DIR, "index.ts");
const INIT_FILE = join(ROOT, "src/db/init.ts");

/* Validate input */

const name = process.argv[2];

if (!name) {
  console.error("Error: migration name is required.");
  console.error("Usage: pnpm idb:add-migration <kebab-case-name>");
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(`Error: "${name}" is not valid kebab-case.`);
  console.error("Use lowercase letters, numbers, and hyphens only.");
  process.exit(1);
}

/* Determine next migration number from DB_VERSION */

const initSource = readFileSync(INIT_FILE, "utf8");
const versionMatch = initSource.match(/^export const DB_VERSION = (\d+);/m);

if (!versionMatch) {
  console.error("Error: could not find DB_VERSION in src/db/init.ts");
  process.exit(1);
}

const currentVersion = Number.parseInt(versionMatch[1], 10);
const nextNum = currentVersion + 1;
const paddedNum = String(nextNum).padStart(3, "0");
const slug = `${paddedNum}-${name}`;

/* Derive a readable title from the slug for comments */

const title = name.replace(/-/g, " ");

/* Write migration file */

const migrationFile = join(MIGRATIONS_DIR, `${slug}.ts`);

if (existsSync(migrationFile)) {
  console.error(`Error: src/db/migrations/${slug}.ts already exists.`);
  process.exit(1);
}
const migrationSource = `import type { Migration } from "../types";

export const migration: Migration = (db) => {
  // TODO: implement ${title}
};
`;

writeFileSync(migrationFile, migrationSource);
console.log(`  created  src/db/migrations/${slug}.ts`);

/* Write test file */

const testFile = join(MIGRATIONS_DIR, `__tests__/${slug}.test.ts`);
const testSource = `import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { migration } from "../${slug}";
import { makeMockDb, runMockMigration } from "../test-utils";

beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

describe("${nextNum}: ${title}", () => {
  it("TODO: describe what this migration does", async () => {
    const db = await runMockMigration(migration, ${nextNum});
    // expect(db.objectStoreNames.contains("...")).toBe(true);
    db.close();
  });

  it("is idempotent", () => {
    const mockDb = makeMockDb([/* stores that already exist after this migration */]);
    expect(() => migration(mockDb, null as any)).not.toThrow();
  });
});
`;

writeFileSync(testFile, testSource);
console.log(`  created  src/db/migrations/__tests__/${slug}.test.ts`);

/* Register in migrations/index.ts */

// add-documents-store → addDocumentsStore
const importAlias = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const indexSource = readFileSync(MIGRATIONS_INDEX, "utf8");

const updatedIndex = indexSource
  .replace(
    /^(import type \{ Migration \} from "\.\.\/types";)/m,
    `$1\nimport { migration as ${importAlias} } from "./${slug}";`,
  )
  .replace(
    /^(export const migrations: Migration\[\] = \[)([\s\S]*?)(\];)/m,
    (_, open, body, close) => `${open}${body}  ${importAlias},\n${close}`,
  );

writeFileSync(MIGRATIONS_INDEX, updatedIndex);
console.log("  updated  src/db/migrations/index.ts");

/* Bump DB_VERSION in init.ts */

const newVersion = nextNum;
const updatedInit = initSource.replace(
  /^export const DB_VERSION = \d+;/m,
  `export const DB_VERSION = ${newVersion};`,
);

writeFileSync(INIT_FILE, updatedInit);
console.log(
  `  updated  src/db/init.ts  (DB_VERSION ${currentVersion} → ${newVersion})`,
);

/* Done */

console.log(`
Next steps:
  1. Implement the migration in src/db/migrations/${slug}.ts
  2. Update NamesakeDBSchema in src/db/types.ts if you added or removed a store
  3. Fill in the tests in src/db/migrations/__tests__/${slug}.test.ts
`);
